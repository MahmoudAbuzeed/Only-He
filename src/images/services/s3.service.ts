import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';
import 'multer';

export interface UploadResult {
  s3_url: string;
  s3_key: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
}

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get('AWS_REGION', 'us-east-1');
    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME', 'only-he-images');

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'images',
    options: {
      resize?: { width?: number; height?: number };
      quality?: number;
    } = {}
  ): Promise<UploadResult> {
    try {
      const fileExtension = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${uuidv4()}.${fileExtension}`;
      const s3Key = `${folder}/${fileName}`;

      let processedBuffer = file.buffer;
      let width: number | undefined;
      let height: number | undefined;

      // Process image with Sharp if it's an image file
      if (file.mimetype.startsWith('image/')) {
        const sharpInstance = sharp(file.buffer);
        const metadata = await sharpInstance.metadata();
        
        width = metadata.width;
        height = metadata.height;

        // Resize if options provided
        if (options.resize?.width || options.resize?.height) {
          sharpInstance.resize(options.resize.width, options.resize.height, {
            fit: 'inside',
            withoutEnlargement: true,
          });
        }

        // Set quality
        if (options.quality) {
          if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
            sharpInstance.jpeg({ quality: options.quality });
          } else if (fileExtension === 'png') {
            sharpInstance.png({ quality: options.quality });
          } else if (fileExtension === 'webp') {
            sharpInstance.webp({ quality: options.quality });
          }
        }

        processedBuffer = await sharpInstance.toBuffer();
      }

      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        Body: processedBuffer,
        ContentType: file.mimetype,
        CacheControl: 'max-age=31536000', // 1 year
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.s3Client.send(uploadCommand);

      const s3Url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${s3Key}`;

      this.logger.log(`Successfully uploaded image: ${fileName} to S3`);

      return {
        s3_url: s3Url,
        s3_key: s3Key,
        file_name: fileName,
        file_size: processedBuffer.length,
        mime_type: file.mimetype,
        width,
        height,
      };
    } catch (error) {
      this.logger.error(`Failed to upload image to S3: ${error.message}`, error.stack);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async deleteImage(s3Key: string): Promise<void> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      });

      await this.s3Client.send(deleteCommand);
      this.logger.log(`Successfully deleted image: ${s3Key} from S3`);
    } catch (error) {
      this.logger.error(`Failed to delete image from S3: ${error.message}`, error.stack);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  async getSignedUrl(s3Key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`, error.stack);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  getFolderPath(entityType: string): string {
    const folderMap = {
      product: 'products',
      category: 'categories',
      package: 'packages',
      user_avatar: 'users/avatars',
      offer: 'offers',
      banner: 'banners',
    };

    return folderMap[entityType] || 'misc';
  }
}
