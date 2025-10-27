import { Injectable } from '@nestjs/common';
import { FavoriteRepository } from './repositories/favorite.repository';
import { ProductRepository } from '../product/repositories/product.repository';
import { ErrorHandler } from 'shared/errorHandler.service';
import { AddToFavoritesDto } from './dto/add-to-favorites.dto';
import {
  CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
} from 'messages';
import { ImagesService } from '../images/images.service';
import { ImageType } from '../images/entities/image.entity';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly productRepository: ProductRepository,
    private readonly errorHandler: ErrorHandler,
    private readonly imagesService: ImagesService,
  ) {}

  async addToFavorites(userId: number, addToFavoritesDto: AddToFavoritesDto) {
    try {
      // Check if product exists
      const product = await this.productRepository.findOne(addToFavoritesDto.product_id);
      if (!product) {
        throw this.errorHandler.notFound({ message: 'Product not found' });
      }

      // Check if already in favorites
      const isAlreadyFavorite = await this.favoriteRepository.isFavorite(
        userId,
        addToFavoritesDto.product_id
      );

      if (isAlreadyFavorite) {
        throw this.errorHandler.badRequest({ message: 'Product is already in favorites' });
      }

      const favorite = await this.favoriteRepository.addToFavorites(
        userId,
        addToFavoritesDto.product_id,
        addToFavoritesDto.notes
      );

      return {
        message: CREATED_SUCCESSFULLY,
        data: {
          favorite_id: favorite.id,
          product_id: favorite.product_id,
        },
      };
    } catch (error) {
      if (error.status === 400 || error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async removeFromFavorites(userId: number, productId: number) {
    try {
      // Check if product exists in favorites
      const isInFavorites = await this.favoriteRepository.isFavorite(userId, productId);
      if (!isInFavorites) {
        throw this.errorHandler.notFound({ message: 'Product not found in favorites' });
      }

      const result = await this.favoriteRepository.removeFromFavorites(userId, productId);
      
      if (result.affected === 0) {
        throw this.errorHandler.notFound({ message: 'Product not found in favorites' });
      }

      return { message: DELETED_SUCCESSFULLY };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getUserFavorites(userId: number) {
    try {
      const favorites = await this.favoriteRepository.getUserFavorites(userId);
      
      // Include images in favorites
      const favoritesWithImages = await this.includeImagesInFavorites(favorites);
      
      const favoriteCount = await this.favoriteRepository.getFavoriteCount(userId);

      return {
        favorites: favoritesWithImages,
        total_count: favoriteCount,
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async getFavoritesByCategory(userId: number, categoryId: number) {
    try {
      const favorites = await this.favoriteRepository.getFavoritesByCategory(userId, categoryId);
      return await this.includeImagesInFavorites(favorites);
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async checkIsFavorite(userId: number, productId: number) {
    try {
      const isFavorite = await this.favoriteRepository.isFavorite(userId, productId);
      return { is_favorite: isFavorite };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async getFavoriteCount(userId: number) {
    try {
      const count = await this.favoriteRepository.getFavoriteCount(userId);
      return { count };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async clearAllFavorites(userId: number) {
    try {
      const result = await this.favoriteRepository.clearAllFavorites(userId);
      
      if (result.affected === 0) {
        return { message: 'No favorites to clear' };
      }

      return { message: `${result.affected} favorites cleared successfully` };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async toggleFavorite(userId: number, productId: number) {
    try {
      const isCurrentlyFavorite = await this.favoriteRepository.isFavorite(userId, productId);
      
      if (isCurrentlyFavorite) {
        await this.removeFromFavorites(userId, productId);
        return { 
          message: 'Removed from favorites',
          is_favorite: false 
        };
      } else {
        await this.addToFavorites(userId, { product_id: productId });
        return { 
          message: 'Added to favorites',
          is_favorite: true 
        };
      }
    } catch (error) {
      if (error.status === 400 || error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  private async includeImagesInFavorites(favorites: any[]): Promise<any[]> {
    if (!favorites || favorites.length === 0) {
      return favorites;
    }

    // Extract product IDs from favorites
    const productIds = favorites
      .filter((fav) => fav.product && fav.product.id)
      .map((fav) => fav.product.id);

    if (productIds.length === 0) {
      return favorites;
    }

    // Fetch images for all products at once
    const imagesMap = await this.imagesService.getImagesByEntities(
      ImageType.PRODUCT,
      productIds
    );
    const primaryImagesMap =
      await this.imagesService.getPrimaryImagesByEntities(
        ImageType.PRODUCT,
        productIds
      );

    // Add images to each favorite's product
    return favorites.map((fav) => {
      if (fav.product && fav.product.id) {
        return {
          ...fav,
          product: {
            ...fav.product,
            images: this.imagesService.formatImagesForResponse(
              imagesMap[fav.product.id] || []
            ),
            primary_image: this.imagesService.formatImageForResponse(
              primaryImagesMap[fav.product.id]
            ),
          },
        };
      }
      return fav;
    });
  }
}
