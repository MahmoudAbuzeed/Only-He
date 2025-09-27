import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@ApiBearerAuth('JWT-auth')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get user cart',
    description: 'Retrieve the current user\'s shopping cart with all items and totals'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cart retrieved successfully',
    example: {
      id: 1,
      items: [
        {
          id: 1,
          product: {
            id: 123,
            name: 'iPhone 15 Pro',
            price: 999.99,
            images: ['image1.jpg']
          },
          quantity: 2,
          unit_price: 999.99,
          total_price: 1999.98
        }
      ],
      subtotal: 1999.98,
      tax_amount: 0,
      shipping_amount: 0,
      discount_amount: 0,
      total: 1999.98,
      item_count: 2
    }
  })
  getCart(@Request() req) {
    // TODO: Extract user ID from JWT token
    // For now, using a placeholder user ID
    const userId = req.user?.id || 1;
    return this.cartService.getCart(userId);
  }

  @Get('count')
  @ApiOperation({ 
    summary: 'Get cart item count',
    description: 'Get the total number of items in the user\'s cart'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cart item count retrieved',
    example: 5
  })
  getCartItemCount(@Request() req) {
    const userId = req.user?.id || 1;
    return this.cartService.getCartItemCount(userId);
  }

  @Post('add')
  @ApiOperation({ 
    summary: 'Add item to cart',
    description: 'Add a product or package to the user\'s shopping cart'
  })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Item added to cart successfully',
    example: { message: 'Item added to cart successfully' }
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid item or insufficient stock' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    const userId = req.user?.id || 1;
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Patch('item/:itemId')
  @ApiOperation({ 
    summary: 'Update cart item',
    description: 'Update cart item quantity or options'
  })
  @ApiParam({ name: 'itemId', description: 'Cart item ID', example: 1 })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Cart item updated successfully',
    example: { message: 'Cart item updated successfully' }
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  updateCartItem(
    @Request() req,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const userId = req.user?.id || 1;
    return this.cartService.updateCartItem(userId, itemId, updateCartItemDto);
  }

  @Patch('item/:itemId/increase')
  @ApiOperation({ 
    summary: 'Increase item quantity',
    description: 'Increase cart item quantity by 1'
  })
  @ApiParam({ name: 'itemId', description: 'Cart item ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Quantity increased successfully',
    example: { 
      message: 'Quantity increased successfully',
      new_quantity: 3
    }
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  increaseQuantity(
    @Request() req,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    const userId = req.user?.id || 1;
    return this.cartService.increaseQuantity(userId, itemId);
  }

  @Patch('item/:itemId/decrease')
  @ApiOperation({ 
    summary: 'Decrease item quantity',
    description: 'Decrease cart item quantity by 1. If quantity becomes 0, item is removed.'
  })
  @ApiParam({ name: 'itemId', description: 'Cart item ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Quantity decreased successfully',
    example: { 
      message: 'Quantity decreased successfully',
      new_quantity: 1
    }
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  decreaseQuantity(
    @Request() req,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    const userId = req.user?.id || 1;
    return this.cartService.decreaseQuantity(userId, itemId);
  }

  @Delete('item/:itemId')
  @ApiOperation({ 
    summary: 'Remove item from cart',
    description: 'Remove a specific item from the shopping cart'
  })
  @ApiParam({ name: 'itemId', description: 'Cart item ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Item removed successfully',
    example: { message: 'Item removed from cart successfully' }
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  removeFromCart(
    @Request() req,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    const userId = req.user?.id || 1;
    return this.cartService.removeFromCart(userId, itemId);
  }

  @Delete('clear')
  @ApiOperation({ 
    summary: 'Clear cart',
    description: 'Remove all items from the shopping cart'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cart cleared successfully',
    example: { message: 'Cart cleared successfully' }
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  clearCart(@Request() req) {
    const userId = req.user?.id || 1;
    return this.cartService.clearCart(userId);
  }
}
