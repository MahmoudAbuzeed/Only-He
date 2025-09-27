import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Request,
  Query,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AddToFavoritesDto } from './dto/add-to-favorites.dto';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  addToFavorites(@Request() req, @Body() addToFavoritesDto: AddToFavoritesDto) {
    // TODO: Extract user ID from JWT token
    const userId = req.user?.id || 1;
    return this.favoriteService.addToFavorites(userId, addToFavoritesDto);
  }

  @Get()
  getUserFavorites(@Request() req, @Query('category_id') categoryId?: string) {
    const userId = req.user?.id || 1;
    
    if (categoryId) {
      return this.favoriteService.getFavoritesByCategory(userId, parseInt(categoryId));
    }
    
    return this.favoriteService.getUserFavorites(userId);
  }

  @Get('count')
  getFavoriteCount(@Request() req) {
    const userId = req.user?.id || 1;
    return this.favoriteService.getFavoriteCount(userId);
  }

  @Get('check/:productId')
  checkIsFavorite(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = req.user?.id || 1;
    return this.favoriteService.checkIsFavorite(userId, productId);
  }

  @Post('toggle/:productId')
  toggleFavorite(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = req.user?.id || 1;
    return this.favoriteService.toggleFavorite(userId, productId);
  }

  @Delete('clear')
  clearAllFavorites(@Request() req) {
    const userId = req.user?.id || 1;
    return this.favoriteService.clearAllFavorites(userId);
  }

  @Delete(':productId')
  removeFromFavorites(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = req.user?.id || 1;
    return this.favoriteService.removeFromFavorites(userId, productId);
  }
}
