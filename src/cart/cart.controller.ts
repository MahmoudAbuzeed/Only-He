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
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiHeader,
} from "@nestjs/swagger";
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";
import { CartIdentityGuard } from "./guards/cart-identity.guard";
import { toLocalizedEntity } from "../common/utils/i18n.util";

@ApiTags("Cart")
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post("guest")
  @ApiOperation({
    summary: "Create guest cart",
    description:
      "Create a new guest cart. Returns guest_cart_id to send in X-Guest-Cart-Id header for all other cart requests. No auth required.",
  })
  @ApiResponse({
    status: 201,
    description: "Guest cart created",
    example: { success: true, data: { guest_cart_id: "uuid-string" } },
  })
  createGuestCart() {
    return this.cartService.createGuestCart().then((data) => ({
      success: true,
      data,
    }));
  }

  @Get()
  @UseGuards(CartIdentityGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiHeader({
    name: "X-Guest-Cart-Id",
    description: "Guest cart ID (use when not logged in instead of Bearer token)",
    required: false,
  })
  @ApiOperation({
    summary: "Get cart",
    description:
      "Retrieve cart by user (Authorization) or guest (X-Guest-Cart-Id). If no cart exists, a new empty cart is created.",
  })
  @ApiResponse({
    status: 200,
    description: "Cart retrieved successfully",
    example: {
      success: true,
      message: "Cart retrieved successfully",
      data: {
        id: 1,
        user_id: 1,
        items: [
          {
            id: 1,
            product: {
              id: 123,
              name: "iPhone 15 Pro",
              price: 999.99,
              images: ["image1.jpg"],
            },
            quantity: 2,
            unit_price: 999.99,
            total_price: 1999.98,
          },
        ],
        subtotal: 1999.98,
        tax_amount: 159.99,
        shipping_amount: 0,
        discount_amount: 0,
        total: 2159.97,
        item_count: 2,
        coupon_code: null,
        status: "active",
        created_at: "2024-01-15T10:00:00.000Z",
        updated_at: "2024-01-15T10:30:00.000Z",
      },
    },
  })
  async getCart(@Request() req: any) {
    const result = await this.cartService.getCart(req.cartIdentity);
    const lang = req.language || "en";
    if (result?.data?.items?.length) {
      result.data.items = result.data.items.map((item: any) => {
        const out = { ...item };
        if (item.product) {
          out.product = toLocalizedEntity(item.product, lang as "en" | "ar", "product");
          if (item.product?.category) {
            out.product.category = toLocalizedEntity(item.product.category, lang as "en" | "ar", "category");
          }
        }
        if (item.package) {
          out.package = toLocalizedEntity(item.package, lang as "en" | "ar", "package");
        }
        return out;
      });
    }
    return result;
  }

  @Get("count")
  @UseGuards(CartIdentityGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiHeader({
    name: "X-Guest-Cart-Id",
    description: "Guest cart ID (when not logged in)",
    required: false,
  })
  @ApiOperation({
    summary: "Get cart item count",
    description:
      "Get the total number of items in the user's cart (returns 0 if no cart exists)",
  })
  @ApiResponse({
    status: 200,
    description: "Cart item count retrieved",
    example: 5,
  })
  getCartItemCount(@Request() req) {
    return this.cartService.getCartItemCount(req.cartIdentity);
  }

  @Post("add")
  @UseGuards(CartIdentityGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiHeader({
    name: "X-Guest-Cart-Id",
    description: "Guest cart ID (when not logged in)",
    required: false,
  })
  @ApiOperation({
    summary: "Add item to cart",
    description:
      "Add a product or package to the user's shopping cart. Cart is automatically created if it doesn't exist.",
  })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({
    status: 201,
    description: "Item added to cart successfully",
    example: {
      success: true,
      message: "Item added to cart successfully",
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - invalid item or insufficient stock",
  })
  @ApiResponse({ status: 404, description: "Product not found" })
  addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.cartIdentity, addToCartDto);
  }

  @Patch("item/:itemId")
  @UseGuards(CartIdentityGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiHeader({ name: "X-Guest-Cart-Id", required: false })
  @ApiOperation({
    summary: "Update cart item",
    description: "Update cart item quantity or options",
  })
  @ApiParam({ name: "itemId", description: "Cart item ID", example: 1 })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({
    status: 200,
    description: "Cart item updated successfully",
    example: {
      success: true,
      message: "Cart item updated successfully",
    },
  })
  @ApiResponse({ status: 404, description: "Cart item not found" })
  @ApiResponse({ status: 400, description: "Insufficient stock" })
  updateCartItem(
    @Request() req,
    @Param("itemId", ParseIntPipe) itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    return this.cartService.updateCartItem(
      req.cartIdentity,
      itemId,
      updateCartItemDto
    );
  }

  @Patch("item/:itemId/increase")
  @UseGuards(CartIdentityGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiHeader({ name: "X-Guest-Cart-Id", required: false })
  @ApiOperation({
    summary: "Increase item quantity",
    description:
      "Increase cart item quantity by 1. Cart totals are automatically recalculated.",
  })
  @ApiParam({ name: "itemId", description: "Cart item ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Quantity increased successfully",
    example: {
      success: true,
      message: "Quantity increased successfully",
      data: {
        new_quantity: 3,
      },
    },
  })
  @ApiResponse({ status: 404, description: "Cart item not found" })
  @ApiResponse({ status: 400, description: "Insufficient stock" })
  increaseQuantity(
    @Request() req,
    @Param("itemId", ParseIntPipe) itemId: number
  ) {
    return this.cartService.increaseQuantity(req.cartIdentity, itemId);
  }

  @Patch("item/:itemId/decrease")
  @UseGuards(CartIdentityGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiHeader({ name: "X-Guest-Cart-Id", required: false })
  @ApiOperation({
    summary: "Decrease item quantity",
    description:
      "Decrease cart item quantity by 1. If quantity becomes 0, item is automatically removed from cart.",
  })
  @ApiParam({ name: "itemId", description: "Cart item ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Quantity decreased successfully",
    example: {
      success: true,
      message: "Quantity decreased successfully",
      data: {
        new_quantity: 1,
      },
    },
  })
  @ApiResponse({ status: 404, description: "Cart item not found" })
  decreaseQuantity(
    @Request() req,
    @Param("itemId", ParseIntPipe) itemId: number
  ) {
    return this.cartService.decreaseQuantity(req.cartIdentity, itemId);
  }

  @Delete("item/:itemId")
  @UseGuards(CartIdentityGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiHeader({ name: "X-Guest-Cart-Id", required: false })
  @ApiOperation({
    summary: "Remove item from cart",
    description:
      "Remove a specific item from the shopping cart. Cart totals are automatically recalculated.",
  })
  @ApiParam({ name: "itemId", description: "Cart item ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Item removed successfully",
    example: {
      success: true,
      message: "Item removed from cart successfully",
    },
  })
  @ApiResponse({ status: 404, description: "Cart item not found" })
  removeFromCart(
    @Request() req,
    @Param("itemId", ParseIntPipe) itemId: number
  ) {
    return this.cartService.removeFromCart(req.cartIdentity, itemId);
  }

  @Post("coupon/apply")
  @UseGuards(CartIdentityGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiHeader({ name: "X-Guest-Cart-Id", required: false })
  @ApiOperation({
    summary: "Apply coupon to cart",
    description:
      "Apply a discount coupon code to the shopping cart. Valid codes: SAVE10 ($10 off), SAVE20 ($20 off), PERCENT10 (10% off), PERCENT20 (20% off)",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        coupon_code: {
          type: "string",
          example: "SAVE10",
          description: "Coupon code to apply",
        },
      },
      required: ["coupon_code"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Coupon applied successfully",
    example: {
      success: true,
      message: "Coupon applied successfully",
      data: {
        coupon_code: "SAVE10",
        discount_amount: 10.0,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid coupon code or empty cart",
  })
  @ApiResponse({ status: 404, description: "Cart not found" })
  applyCoupon(@Request() req, @Body("coupon_code") couponCode: string) {
    return this.cartService.applyCoupon(req.cartIdentity, couponCode);
  }

  @Delete("coupon")
  @UseGuards(CartIdentityGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiHeader({ name: "X-Guest-Cart-Id", required: false })
  @ApiOperation({
    summary: "Remove coupon from cart",
    description: "Remove the applied coupon code from the shopping cart",
  })
  @ApiResponse({
    status: 200,
    description: "Coupon removed successfully",
    example: {
      success: true,
      message: "Coupon removed successfully",
    },
  })
  @ApiResponse({ status: 404, description: "Cart not found" })
  removeCoupon(@Request() req) {
    return this.cartService.removeCoupon(req.cartIdentity);
  }

  @Delete("clear")
  @UseGuards(CartIdentityGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiHeader({ name: "X-Guest-Cart-Id", required: false })
  @ApiOperation({
    summary: "Clear cart",
    description: "Remove all items from the shopping cart",
  })
  @ApiResponse({
    status: 200,
    description: "Cart cleared successfully",
    example: {
      success: true,
      message: "Cart cleared successfully",
    },
  })
  @ApiResponse({ status: 404, description: "Cart not found" })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.cartIdentity);
  }
}
