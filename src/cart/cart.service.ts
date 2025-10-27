import { Injectable } from "@nestjs/common";
import { CartRepository } from "./repositories/cart.repository";
import { ProductRepository } from "../product/repositories/product.repository";
import { ErrorHandler } from "shared/errorHandler.service";
import { ResponseUtil } from "../common/utils/response.util";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";
import { CartItemType } from "./entities/cart-item.entity";
import { CartStatus } from "./entities/cart.entity";
import { ImagesService } from "../images/images.service";
import { ImageType } from "../images/entities/image.entity";

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly errorHandler: ErrorHandler,
    private readonly imagesService: ImagesService
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
      // Auto-create cart if it doesn't exist (e-commerce best practice)
      let cart = await this.cartRepository.findActiveCartByUser(userId);

      if (!cart) {
        cart = await this.cartRepository.createCart(userId);
        // Return newly created empty cart
        return ResponseUtil.success("Cart retrieved successfully", {
          id: cart.id,
          user_id: cart.user_id,
          items: [],
          subtotal: 0,
          tax_amount: 0,
          shipping_amount: 0,
          discount_amount: 0,
          total: 0,
          item_count: 0,
          status: cart.status,
          created_at: cart.created_at,
        });
      }

      const itemCount = await this.cartRepository.getCartItemCount(cart.id);

      // Include images in cart items
      const itemsWithImages = await this.includeImagesInCartItems(
        cart.items || []
      );

      return ResponseUtil.success("Cart retrieved successfully", {
        id: cart.id,
        user_id: cart.user_id,
        items: itemsWithImages,
        subtotal: cart.subtotal || 0,
        tax_amount: cart.tax_amount || 0,
        shipping_amount: cart.shipping_amount || 0,
        discount_amount: cart.discount_amount || 0,
        total: cart.total || 0,
        item_count: itemCount,
        coupon_code: cart.coupon_code || null,
        status: cart.status,
        created_at: cart.created_at,
        updated_at: cart.updated_at,
      });
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async applyCoupon(userId: number, couponCode: string) {
    try {
      const cart = await this.cartRepository.findActiveCartByUser(userId);
      if (!cart) {
        throw this.errorHandler.notFound({ message: "Cart not found" });
      }

      if (!cart.items || cart.items.length === 0) {
        throw this.errorHandler.badRequest({
          message: "Cannot apply coupon to empty cart",
        });
      }

      // TODO: Integrate with coupon/discount service to validate coupon
      // For now, using a simple mock validation
      const validCoupons: Record<string, number> = {
        SAVE10: 10, // $10 off
        SAVE20: 20, // $20 off
        PERCENT10: 0.1, // 10% off
        PERCENT20: 0.2, // 20% off
      };

      const coupon = validCoupons[couponCode.toUpperCase()];
      if (!coupon) {
        throw this.errorHandler.badRequest({
          message: "Invalid coupon code",
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon < 1) {
        // Percentage discount
        discountAmount = cart.subtotal * coupon;
      } else {
        // Fixed amount discount
        discountAmount = coupon;
      }

      // Ensure discount doesn't exceed subtotal
      discountAmount = Math.min(discountAmount, cart.subtotal);

      await this.cartRepository.applyCoupon(
        cart.id,
        couponCode,
        discountAmount
      );

      // Recalculate totals with new discount
      await this.recalculateCartTotals(cart.id);

      return ResponseUtil.success("Coupon applied successfully", {
        coupon_code: couponCode,
        discount_amount: discountAmount,
      });
    } catch (error) {
      if (error.status === 400 || error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async removeCoupon(userId: number) {
    try {
      const cart = await this.cartRepository.findActiveCartByUser(userId);
      if (!cart) {
        throw this.errorHandler.notFound({ message: "Cart not found" });
      }

      await this.cartRepository.applyCoupon(cart.id, null, 0);
      await this.recalculateCartTotals(cart.id);

      return ResponseUtil.successNoData("Coupon removed successfully");
    } catch (error) {
      if (error.status === 404) throw error;
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

    // Calculate subtotal from all items
    let subtotal = 0;
    for (const item of cart.items) {
      subtotal += item.total_price;
    }

    // Get discount amount (from coupon or manual discount)
    const discountAmount = cart.discount_amount || 0;

    // Calculate subtotal after discount (before tax)
    const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);

    // Calculate tax (applied after discount)
    // TODO: Make tax rate configurable per region/country
    const taxRate = parseFloat(process.env.TAX_RATE || "0.08"); // Default 8%
    const taxAmount = subtotalAfterDiscount * taxRate;

    // Calculate shipping based on cart value
    // TODO: Make shipping rules configurable
    let shippingAmount = 0;
    const freeShippingThreshold = parseFloat(
      process.env.FREE_SHIPPING_THRESHOLD || "50"
    );
    const standardShippingRate = parseFloat(
      process.env.STANDARD_SHIPPING_RATE || "9.99"
    );

    if (subtotalAfterDiscount < freeShippingThreshold) {
      shippingAmount = standardShippingRate;
    }
    // Free shipping if subtotal (after discount) >= threshold

    // Calculate final total
    const total = subtotalAfterDiscount + taxAmount + shippingAmount;

    await this.cartRepository.updateCartTotals(cartId, {
      subtotal,
      tax_amount: parseFloat(taxAmount.toFixed(2)),
      shipping_amount: parseFloat(shippingAmount.toFixed(2)),
      discount_amount: parseFloat(discountAmount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    });
  }

  private async includeImagesInCartItems(cartItems: any[]): Promise<any[]> {
    if (!cartItems || cartItems.length === 0) {
      return cartItems;
    }

    // Extract product IDs from cart items
    const productIds = cartItems
      .filter((item) => item.product && item.product.id)
      .map((item) => item.product.id);

    if (productIds.length === 0) {
      return cartItems;
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

    // Add images to each cart item's product
    return cartItems.map((item) => {
      if (item.product && item.product.id) {
        return {
          ...item,
          product: {
            ...item.product,
            images: this.imagesService.formatImagesForResponse(
              imagesMap[item.product.id] || []
            ),
            primary_image: this.imagesService.formatImageForResponse(
              primaryImagesMap[item.product.id]
            ),
          },
        };
      }
      return item;
    });
  }
}
