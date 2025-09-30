import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImageType } from './entities/image.entity';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload an image',
    description: 'Upload an image file to S3 and save metadata to database',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image upload data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
        entity_type: {
          type: 'string',
          enum: Object.values(ImageType),
          description: 'Type of entity the image belongs to',
        },
        entity_id: {
          type: 'integer',
          description: 'ID of the entity the image belongs to',
        },
        alt_text: {
          type: 'string',
          description: 'Alternative text for the image',
        },
        caption: {
          type: 'string',
          description: 'Caption for the image',
        },
        is_primary: {
          type: 'boolean',
          description: 'Whether this is the primary image for the entity',
        },
        sort_order: {
          type: 'integer',
          description: 'Sort order for displaying images',
        },
      },
      required: ['file', 'entity_type', 'entity_id'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    example: {
      id: 1,
      original_name: 'product-image.jpg',
      file_name: 'uuid-generated-name.jpg',
      s3_url: 'https://only-he-images.s3.us-east-1.amazonaws.com/products/uuid-generated-name.jpg',
      entity_type: 'product',
      entity_id: 1,
      mime_type: 'image/jpeg',
      file_size: 245760,
      width: 800,
      height: 600,
      is_primary: true,
      alt_text: 'Product main image',
      created_at: '2025-09-29T12:00:00Z',
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid file or data' })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadImageDto: UploadImageDto,
  ) {
    return await this.imagesService.uploadImage(file, uploadImageDto);
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({
    summary: 'Get images by entity',
    description: 'Get all images for a specific entity (product, category, etc.)',
  })
  @ApiParam({
    name: 'entityType',
    enum: ImageType,
    description: 'Type of entity',
  })
  @ApiParam({
    name: 'entityId',
    type: 'integer',
    description: 'ID of the entity',
  })
  @ApiResponse({
    status: 200,
    description: 'Images retrieved successfully',
    example: [
      {
        id: 1,
        url: 'https://only-he-images.s3.us-east-1.amazonaws.com/products/image1.jpg',
        alt_text: 'Product main image',
        caption: 'High quality product image',
        is_primary: true,
        width: 800,
        height: 600,
        file_size: 245760,
      },
    ],
  })
  async getImagesByEntity(
    @Param('entityType') entityType: ImageType,
    @Param('entityId', ParseIntPipe) entityId: number,
  ) {
    const images = await this.imagesService.findImagesByEntity(entityType, entityId);
    return this.imagesService.formatImagesForResponse(images);
  }

  @Get('entity/:entityType/:entityId/primary')
  @ApiOperation({
    summary: 'Get primary image by entity',
    description: 'Get the primary image for a specific entity',
  })
  @ApiParam({
    name: 'entityType',
    enum: ImageType,
    description: 'Type of entity',
  })
  @ApiParam({
    name: 'entityId',
    type: 'integer',
    description: 'ID of the entity',
  })
  @ApiResponse({
    status: 200,
    description: 'Primary image retrieved successfully',
    example: {
      id: 1,
      url: 'https://only-he-images.s3.us-east-1.amazonaws.com/products/image1.jpg',
      alt_text: 'Product main image',
      is_primary: true,
      width: 800,
      height: 600,
    },
  })
  async getPrimaryImage(
    @Param('entityType') entityType: ImageType,
    @Param('entityId', ParseIntPipe) entityId: number,
  ) {
    const image = await this.imagesService.findPrimaryImage(entityType, entityId);
    return this.imagesService.formatImageForResponse(image);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get image by ID',
    description: 'Get a specific image by its ID',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Image ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Image retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async getImageById(@Param('id', ParseIntPipe) id: number) {
    const image = await this.imagesService.findImageById(id);
    return this.imagesService.formatImageForResponse(image);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update image metadata',
    description: 'Update image metadata (alt text, caption, primary status, etc.)',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Image ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Image updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    const image = await this.imagesService.updateImage(id, updateImageDto);
    return this.imagesService.formatImageForResponse(image);
  }

  @Put(':id/set-primary')
  @ApiOperation({
    summary: 'Set image as primary',
    description: 'Set this image as the primary image for its entity',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Image ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Image set as primary successfully',
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async setPrimaryImage(@Param('id', ParseIntPipe) id: number) {
    const image = await this.imagesService.setPrimaryImage(id);
    return this.imagesService.formatImageForResponse(image);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete image',
    description: 'Delete an image from both S3 and database',
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Image ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    await this.imagesService.deleteImage(id);
    return { message: 'Image deleted successfully' };
  }
}
