import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { Favorite } from './entities/favorite.entity';
import { FavoriteRepository } from './repositories/favorite.repository';
import { ProductModule } from '../product/product.module';
import { ErrorHandler } from 'shared/errorHandler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    ProductModule,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository, ErrorHandler],
  exports: [FavoriteService, FavoriteRepository],
})
export class FavoriteModule {}
