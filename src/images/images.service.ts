import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ImagesRepository } from './images.repository';
import { S3Service } from './services/s3.service';
import { Image, ImageType } from './entities/image.entity';
import { UploadImageDto } from './dto/upload-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    private readonly imagesRepository: ImagesRepository,
    private readonly s3Service: S3Service,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    uploadImageDto: UploadImageDto,
  ): Promise<Image> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 10MB');
    }

    try {
      // Get folder path based on entity type
      const folderPath = this.s3Service.getFolderPath(uploadImageDto.entity_type);

      // Upload to S3
      const uploadResult = await this.s3Service.uploadImage(file, folderPath, {
        resize: { width: 1200, height: 1200 }, // Max dimensions
        quality: 85,
      });

      // If this is set as primary, remove primary flag from other images
      if (uploadImageDto.is_primary) {
        await this.imagesRepository.setPrimaryImage(
          uploadImageDto.entity_type,
          uploadImageDto.entity_id,
          0, // Will be updated after creation
        );
      }

      // Create image record in database
      const imageData: Partial<Image> = {
        original_name: file.originalname,
        file_name: uploadResult.file_name,
        s3_url: uploadResult.s3_url,
        s3_key: uploadResult.s3_key,
        entity_type: uploadImageDto.entity_type,
        entity_id: uploadImageDto.entity_id,
        mime_type: uploadResult.mime_type,
        file_size: uploadResult.file_size,
        width: uploadResult.width,
        height: uploadResult.height,
        is_primary: uploadImageDto.is_primary || false,
        sort_order: uploadImageDto.sort_order || 0,
        alt_text: uploadImageDto.alt_text,
        caption: uploadImageDto.caption,
      };

      const savedImage = await this.imagesRepository.create(imageData);

      // If this should be primary, update it properly
      if (uploadImageDto.is_primary) {
        await this.imagesRepository.setPrimaryImage(
          uploadImageDto.entity_type,
          uploadImageDto.entity_id,
          savedImage.id,
        );
        savedImage.is_primary = true;
      }

      return savedImage;
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  async findImagesByEntity(entityType: ImageType, entityId: number): Promise<Image[]> {
    return await this.imagesRepository.findByEntity(entityType, entityId);
  }

  async findPrimaryImage(entityType: ImageType, entityId: number): Promise<Image | null> {
    return await this.imagesRepository.findPrimaryImage(entityType, entityId);
  }

  async findImageById(id: number): Promise<Image> {
    const image = await this.imagesRepository.findById(id);
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }

  async updateImage(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.findImageById(id);

    // If setting as primary, remove primary flag from other images
    if (updateImageDto.is_primary) {
      await this.imagesRepository.setPrimaryImage(
        image.entity_type,
        image.entity_id,
        id,
      );
    }

    const updatedImage = await this.imagesRepository.update(id, updateImageDto);
    if (!updatedImage) {
      throw new NotFoundException('Image not found');
    }

    return updatedImage;
  }

  async deleteImage(id: number): Promise<void> {
    const image = await this.findImageById(id);

    try {
      // Delete from S3
      await this.s3Service.deleteImage(image.s3_key);
    } catch (error) {
      // Log error but don't fail the operation
      console.error(`Failed to delete image from S3: ${error.message}`);
    }

    // Soft delete from database
    await this.imagesRepository.delete(id);
  }

  async setPrimaryImage(id: number): Promise<Image> {
    const image = await this.findImageById(id);
    
    await this.imagesRepository.setPrimaryImage(
      image.entity_type,
      image.entity_id,
      id,
    );

    return await this.findImageById(id);
  }

  // Helper method to get images for multiple entities at once
  async getImagesByEntities(
    entityType: ImageType,
    entityIds: number[],
  ): Promise<{ [entityId: number]: Image[] }> {
    return await this.imagesRepository.getImagesByEntities(entityType, entityIds);
  }

  // Helper method to get primary images for multiple entities at once
  async getPrimaryImagesByEntities(
    entityType: ImageType,
    entityIds: number[],
  ): Promise<{ [entityId: number]: Image | null }> {
    return await this.imagesRepository.getPrimaryImagesByEntities(entityType, entityIds);
  }

  // Helper method to format image data for API responses
  formatImageForResponse(image: Image | null): any {
    if (!image) return null;

    return {
      id: image.id,
      url: image.s3_url,
      alt_text: image.alt_text,
      caption: image.caption,
      is_primary: image.is_primary,
      width: image.width,
      height: image.height,
      file_size: image.file_size,
    };
  }

  // Helper method to format multiple images for API responses
  formatImagesForResponse(images: Image[]): any[] {
    return images.map(image => this.formatImageForResponse(image));
  }
}
