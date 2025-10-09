import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Favorite } from '../entities/favorite.entity';

@Injectable()
export class FavoriteRepository {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  async addToFavorites(userId: number, productId: number, notes?: string): Promise<Favorite> {
    const favorite = this.favoriteRepository.create({
      user_id: userId,
      product_id: productId,
      notes,
    });
    return await this.favoriteRepository.save(favorite);
  }

  async removeFromFavorites(userId: number, productId: number) {
    return await this.favoriteRepository.delete({
      user_id: userId,
      product_id: productId,
    });
  }

  async getUserFavorites(userId: number): Promise<Favorite[]> {
    return await this.favoriteRepository.find({
      where: { user_id: userId },
      relations: ['product', 'product.category'],
      order: { created_at: 'DESC' },
    });
  }

  async isFavorite(userId: number, productId: number): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: { user_id: userId, product_id: productId },
    });
    return !!favorite;
  }

  async getFavoriteById(userId: number, favoriteId: number): Promise<Favorite> {
    return await this.favoriteRepository.findOne({
      where: { id: favoriteId, user_id: userId },
      relations: ['product', 'product.category'],
    });
  }

  async getFavoriteCount(userId: number): Promise<number> {
    return await this.favoriteRepository.count({
      where: { user_id: userId },
    });
  }

  async getFavoritesByCategory(userId: number, categoryId: number): Promise<Favorite[]> {
    return await this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.product', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .where('favorite.user_id = :userId', { userId })
      .andWhere('product.category_id = :categoryId', { categoryId })
      .orderBy('favorite.created_at', 'DESC')
      .getMany();
  }

  async clearAllFavorites(userId: number) {
    return await this.favoriteRepository.delete({ user_id: userId });
  }

  // Additional method for admin services
  createQueryBuilder(alias: string) {
    return this.favoriteRepository.createQueryBuilder(alias);
  }
}
