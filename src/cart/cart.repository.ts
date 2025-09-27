import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Cart, CartStatus } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async findActiveCartByUser(userId: number): Promise<Cart> {
    return await this.cartRepository.findOne({
      where: { user_id: userId, status: CartStatus.ACTIVE },
      relations: ['items', 'items.product', 'items.package'],
    });
  }

  async createCart(userId: number): Promise<Cart> {
    const cart = this.cartRepository.create({
      user_id: userId,
      status: CartStatus.ACTIVE,
      subtotal: 0,
      total: 0,
    });
    return await this.cartRepository.save(cart);
  }

  async findCartById(cartId: number): Promise<Cart> {
    return await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['items', 'items.product', 'items.package', 'user'],
    });
  }

  async updateCartTotals(cartId: number, totals: {
    subtotal: number;
    tax_amount?: number;
    shipping_amount?: number;
    discount_amount?: number;
    total: number;
  }) {
    return await this.cartRepository.update(cartId, {
      ...totals,
      last_activity: new Date(),
    });
  }

  async addItemToCart(cartItem: Partial<CartItem>): Promise<CartItem> {
    const item = this.cartItemRepository.create(cartItem);
    return await this.cartItemRepository.save(item);
  }

  async findCartItem(cartId: number, productId?: number, packageId?: number): Promise<CartItem> {
    const whereCondition: any = { cart_id: cartId };
    
    if (productId) {
      whereCondition.product_id = productId;
    }
    if (packageId) {
      whereCondition.package_id = packageId;
    }

    return await this.cartItemRepository.findOne({
      where: whereCondition,
      relations: ['product', 'package'],
    });
  }

  async updateCartItem(itemId: number, updates: Partial<CartItem>) {
    return await this.cartItemRepository.update(itemId, updates);
  }

  async removeCartItem(itemId: number) {
    return await this.cartItemRepository.delete(itemId);
  }

  async clearCart(cartId: number) {
    await this.cartItemRepository.delete({ cart_id: cartId });
    return await this.cartRepository.update(cartId, {
      subtotal: 0,
      tax_amount: 0,
      shipping_amount: 0,
      discount_amount: 0,
      total: 0,
      coupon_code: null,
      applied_offers: null,
    });
  }

  async updateCartStatus(cartId: number, status: CartStatus) {
    return await this.cartRepository.update(cartId, { status });
  }

  async getCartItemCount(cartId: number): Promise<number> {
    return await this.cartItemRepository.count({ where: { cart_id: cartId } });
  }

  async applyCoupon(cartId: number, couponCode: string, discountAmount: number) {
    return await this.cartRepository.update(cartId, {
      coupon_code: couponCode,
      discount_amount: discountAmount,
    });
  }
}
