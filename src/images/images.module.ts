import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { ImagesRepository } from './repositories/images.repository';
import { S3Service } from './services/s3.service';
import { Image } from './entities/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    ConfigModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository, S3Service],
  exports: [ImagesService, ImagesRepository, S3Service],
})
export class ImagesModule {}
