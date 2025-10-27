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
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { FavoriteService } from "./favorite.service";
import { AddToFavoritesDto } from "./dto/add-to-favorites.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";

@ApiTags("Favorites")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("favorite")
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @ApiOperation({ summary: "Add product to favorites" })
  @ApiResponse({ status: 201, description: "Product added to favorites" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  addToFavorites(@Request() req, @Body() addToFavoritesDto: AddToFavoritesDto) {
    return this.favoriteService.addToFavorites(req.user.id, addToFavoritesDto);
  }

  @Get()
  @ApiOperation({ summary: "Get user favorites" })
  @ApiResponse({ status: 200, description: "Favorites retrieved successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getUserFavorites(@Request() req, @Query("category_id") categoryId?: string) {
    if (categoryId) {
      return this.favoriteService.getFavoritesByCategory(
        req.user.id,
        parseInt(categoryId)
      );
    }

    return this.favoriteService.getUserFavorites(req.user.id);
  }

  @Get("count")
  @ApiOperation({ summary: "Get favorite count" })
  @ApiResponse({ status: 200, description: "Favorite count retrieved" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getFavoriteCount(@Request() req) {
    return this.favoriteService.getFavoriteCount(req.user.id);
  }

  @Get("check/:productId")
  @ApiOperation({ summary: "Check if product is favorite" })
  @ApiParam({ name: "productId", description: "Product ID" })
  @ApiResponse({ status: 200, description: "Check result returned" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  checkIsFavorite(
    @Request() req,
    @Param("productId", ParseIntPipe) productId: number
  ) {
    return this.favoriteService.checkIsFavorite(req.user.id, productId);
  }

  @Post("toggle/:productId")
  @ApiOperation({ summary: "Toggle product favorite status" })
  @ApiParam({ name: "productId", description: "Product ID" })
  @ApiResponse({ status: 200, description: "Favorite toggled successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  toggleFavorite(
    @Request() req,
    @Param("productId", ParseIntPipe) productId: number
  ) {
    return this.favoriteService.toggleFavorite(req.user.id, productId);
  }

  @Delete("clear")
  @ApiOperation({ summary: "Clear all favorites" })
  @ApiResponse({ status: 200, description: "Favorites cleared successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  clearAllFavorites(@Request() req) {
    return this.favoriteService.clearAllFavorites(req.user.id);
  }

  @Delete(":productId")
  @ApiOperation({ summary: "Remove product from favorites" })
  @ApiParam({ name: "productId", description: "Product ID" })
  @ApiResponse({ status: 200, description: "Product removed from favorites" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  removeFromFavorites(
    @Request() req,
    @Param("productId", ParseIntPipe) productId: number
  ) {
    return this.favoriteService.removeFromFavorites(req.user.id, productId);
  }
}
