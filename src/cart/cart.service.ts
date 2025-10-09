import { Injectable } from "@nestjs/common";
import { CartRepository } from "./repositories/cart.repository";
import { ProductRepository } from "../product/repositories/product.repository";
import { ErrorHandler } from "shared/errorHandler.service";
import { ResponseUtil } from "../common/utils/response.util";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";
import { CartItemType } from "./entities/cart-item.entity";
import { CartStatus } from "./entities/cart.entity";

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly errorHandler: ErrorHandler
  ) {}

  async getOrCreateCart(userId: number) {
    try {
      let cart = await this.cartRepository.findActiveCartByUser(userId);

      if (!cart) {
        cart = await this.cartRepository.createCart(userId);
      }

      return cart;
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    try {
      const cart = await this.getOrCreateCart(userId);

      // Validate item exists and is available
      if (addToCartDto.item_type === CartItemType.PRODUCT) {
        if (!addToCartDto.product_id) {
          throw this.errorHandler.badRequest({
            message: "Product ID is required",
          });
        }

        const product = await this.productRepository.findOne(
          addToCartDto.product_id
        );
        if (!product) {
          throw this.errorHandler.notFound({ message: "Product not found" });
        }

        // Check stock availability
        if (product.manage_stock && !product.allow_backorder) {
          if (product.stock_quantity < addToCartDto.quantity) {
            throw this.errorHandler.badRequest({
              message: `Only ${product.stock_quantity} items available in stock`,
            });
          }
        }

        // Check if item already exists in cart
        const existingItem = await this.cartRepository.findCartItem(
          cart.id,
          addToCartDto.product_id
        );

        if (existingItem) {
          // Update quantity
          const newQuantity = existingItem.quantity + addToCartDto.quantity;

          // Check stock for new quantity
          if (product.manage_stock && !product.allow_backorder) {
            if (product.stock_quantity < newQuantity) {
              throw this.errorHandler.badRequest({
                message: `Only ${product.stock_quantity} items available in stock`,
              });
            }
          }

          const totalPrice = newQuantity * product.price;
          await this.cartRepository.updateCartItem(existingItem.id, {
            quantity: newQuantity,
            total_price: totalPrice,
          });
        } else {
          // Add new item
          await this.cartRepository.addItemToCart({
            cart_id: cart.id,
            item_type: addToCartDto.item_type,
            product_id: addToCartDto.product_id,
            quantity: addToCartDto.quantity,
            unit_price: product.price,
            total_price: product.price * addToCartDto.quantity,
            product_options: addToCartDto.product_options,
          });
        }
      }

      // Handle package items (if package_id is provided instead of product_id)
      // Package handling would be implemented here when package functionality is needed

      // Recalculate cart totals
      await this.recalculateCartTotals(cart.id);

      return ResponseUtil.successNoData("Item added to cart successfully");
    } catch (error) {
      if (error.status === 400 || error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async increaseQuantity(userId: number, itemId: number) {
    try {
      const cart = await this.cartRepository.findActiveCartByUser(userId);
      if (!cart) {
        throw this.errorHandler.notFound({ message: "Cart not found" });
      }

      const cartItem = cart.items.find((item) => item.id === itemId);
      if (!cartItem) {
        throw this.errorHandler.notFound({ message: "Cart item not found" });
      }

      const newQuantity = cartItem.quantity + 1;

      // Validate stock if product
      if (cartItem.product) {
        const product = cartItem.product;
        if (product.manage_stock && !product.allow_backorder) {
          if (product.stock_quantity < newQuantity) {
            throw this.errorHandler.badRequest({
              message: `Only ${product.stock_quantity} items available in stock`,
            });
          }
        }
      }

      const totalPrice = newQuantity * cartItem.unit_price;
      await this.cartRepository.updateCartItem(itemId, {
        quantity: newQuantity,
        total_price: totalPrice,
      });

      // Recalculate cart totals
      await this.recalculateCartTotals(cart.id);

      return ResponseUtil.success("Quantity increased successfully", {
        new_quantity: newQuantity,
      });
    } catch (error) {
      if (error.status === 400 || error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async decreaseQuantity(userId: number, itemId: number) {
    try {
      const cart = await this.cartRepository.findActiveCartByUser(userId);
      if (!cart) {
        throw this.errorHandler.notFound({ message: "Cart not found" });
      }

      const cartItem = cart.items.find((item) => item.id === itemId);
      if (!cartItem) {
        throw this.errorHandler.notFound({ message: "Cart item not found" });
      }

      if (cartItem.quantity <= 1) {
        // If quantity is 1, remove the item instead
        return await this.removeFromCart(userId, itemId);
      }

      const newQuantity = cartItem.quantity - 1;
      const totalPrice = newQuantity * cartItem.unit_price;

      await this.cartRepository.updateCartItem(itemId, {
        quantity: newQuantity,
        total_price: totalPrice,
      });

      // Recalculate cart totals
      await this.recalculateCartTotals(cart.id);

      return ResponseUtil.success("Quantity decreased successfully", {
        new_quantity: newQuantity,
      });
    } catch (error) {
      if (error.status === 400 || error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async updateCartItem(
    userId: number,
    itemId: number,
    updateDto: UpdateCartItemDto
  ) {
    try {
      const cart = await this.cartRepository.findActiveCartByUser(userId);
      if (!cart) {
        throw this.errorHandler.notFound({ message: "Cart not found" });
      }

      const cartItem = cart.items.find((item) => item.id === itemId);
      if (!cartItem) {
        throw this.errorHandler.notFound({ message: "Cart item not found" });
      }

      // Validate stock if updating quantity
      if (updateDto.quantity && cartItem.product) {
        const product = cartItem.product;
        if (product.manage_stock && !product.allow_backorder) {
          if (product.stock_quantity < updateDto.quantity) {
            throw this.errorHandler.badRequest({
              message: `Only ${product.stock_quantity} items available in stock`,
            });
          }
        }

        const totalPrice = updateDto.quantity * cartItem.unit_price;
        await this.cartRepository.updateCartItem(itemId, {
          quantity: updateDto.quantity,
          total_price: totalPrice,
          product_options:
            updateDto.product_options || cartItem.product_options,
        });
      }

      // Recalculate cart totals
      await this.recalculateCartTotals(cart.id);

      return ResponseUtil.successNoData("Cart item updated successfully");
    } catch (error) {
      if (error.status === 400 || error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async removeFromCart(userId: number, itemId: number) {
    try {
      const cart = await this.cartRepository.findActiveCartByUser(userId);
      if (!cart) {
        throw this.errorHandler.notFound({ message: "Cart not found" });
      }

      const cartItem = cart.items.find((item) => item.id === itemId);
      if (!cartItem) {
        throw this.errorHandler.notFound({ message: "Cart item not found" });
      }

      await this.cartRepository.removeCartItem(itemId);

      // Recalculate cart totals
      await this.recalculateCartTotals(cart.id);

      return ResponseUtil.successNoData("Item removed from cart successfully");
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getCart(userId: number) {
    try {
      const cart = await this.cartRepository.findActiveCartByUser(userId);
      if (!cart) {
        // Return empty cart structure
        return ResponseUtil.success("Cart retrieved successfully", {
          id: null,
          items: [],
          subtotal: 0,
          tax_amount: 0,
          shipping_amount: 0,
          discount_amount: 0,
          total: 0,
          item_count: 0,
        });
      }

      const itemCount = await this.cartRepository.getCartItemCount(cart.id);

      return ResponseUtil.success("Cart retrieved successfully", {
        ...cart,
        item_count: itemCount,
      });
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async clearCart(userId: number) {
    try {
      const cart = await this.cartRepository.findActiveCartByUser(userId);
      if (!cart) {
        throw this.errorHandler.notFound({ message: "Cart not found" });
      }

      await this.cartRepository.clearCart(cart.id);

      return ResponseUtil.successNoData("Cart cleared successfully");
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getCartItemCount(userId: number): Promise<number> {
    try {
      const cart = await this.cartRepository.findActiveCartByUser(userId);
      if (!cart) {
        return 0;
      }

      return await this.cartRepository.getCartItemCount(cart.id);
    } catch (error) {
      return 0;
    }
  }

  private async recalculateCartTotals(cartId: number) {
    const cart = await this.cartRepository.findCartById(cartId);
    if (!cart || !cart.items) return;

    let subtotal = 0;

    for (const item of cart.items) {
      subtotal += item.total_price;
    }

    // Calculate tax, shipping, and apply discounts
    const taxRate = 0.08; // 8% tax rate - should be configurable based on location
    const taxAmount = subtotal * taxRate;

    // Calculate shipping based on cart value and items
    let shippingAmount = 0;
    if (subtotal < 50) {
      // Free shipping over $50
      shippingAmount = 9.99; // Standard shipping rate
    }

    const discountAmount = cart.discount_amount || 0;

    const total = subtotal + taxAmount + shippingAmount - discountAmount;

    await this.cartRepository.updateCartTotals(cartId, {
      subtotal,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      discount_amount: discountAmount,
      total,
    });
  }
}
