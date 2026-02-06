import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Request,
  Patch,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiHeader,
} from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderStatus } from "./entities/order.entity";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CartIdentityGuard } from "../cart/guards/cart-identity.guard";

@ApiTags("Orders")
@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(CartIdentityGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiHeader({
    name: "X-Guest-Cart-Id",
    description: "Guest cart ID (required for guest checkout when not logged in)",
    required: false,
  })
  @ApiOperation({
    summary: "Create new order from cart",
    description:
      "Creates an order from cart. Use Authorization (logged-in) or X-Guest-Cart-Id + phone + shipping_address (guest). Cart must have items. Reserves stock and clears cart after creation.",
  })
  @ApiBody({
    type: CreateOrderDto,
    description: "Order details including shipping and billing addresses",
    examples: {
      saved_address: {
        summary: "Using Saved Address (Recommended - Fast Checkout)",
        value: {
          shipping_address_id: 5,
          billing_address_id: 5,
          shipping_method: "standard",
          payment_method: "cash_on_delivery",
          notes: "Please deliver after 5 PM",
        },
      },
      new_address_with_save: {
        summary: "New Address + Save for Future",
        value: {
          shipping_address: {
            first_name: "John",
            last_name: "Doe",
            address_line_1: "123 Main Street",
            address_line_2: "Apt 4B",
            city: "New York",
            state: "NY",
            postal_code: "10001",
            country: "United States",
            phone: "+1234567890",
          },
          save_shipping_address: true,
          address_label: "Home",
          shipping_method: "standard",
          payment_method: "cash_on_delivery",
        },
      },
      complete_order: {
        summary: "Complete Order (Without Saving)",
        value: {
          shipping_address: {
            first_name: "John",
            last_name: "Doe",
            address_line_1: "123 Main Street",
            address_line_2: "Apt 4B",
            city: "New York",
            state: "NY",
            postal_code: "10001",
            country: "United States",
            phone: "+1234567890",
          },
          billing_address: {
            first_name: "John",
            last_name: "Doe",
            address_line_1: "123 Main Street",
            city: "New York",
            state: "NY",
            postal_code: "10001",
            country: "United States",
            phone: "+1234567890",
          },
          shipping_method: "standard",
          payment_method: "cash_on_delivery",
          notes: "Please deliver after 5 PM",
          coupon_code: "SAVE10",
        },
      },
      minimal_order: {
        summary: "Minimal Order (Uses Default Address)",
        value: {
          shipping_method: "standard",
          payment_method: "cash_on_delivery",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Order created successfully",
    example: {
      id: 1,
      order_number: "ORD-2024-000001",
      user_id: 1,
      status: "pending",
      payment_status: "pending",
      subtotal: 1999.98,
      tax_amount: 159.99,
      shipping_amount: 9.99,
      discount_amount: 0,
      total_amount: 2169.96,
      shipping_address: {
        first_name: "John",
        last_name: "Doe",
        address_line_1: "123 Main Street",
        city: "New York",
        state: "NY",
        postal_code: "10001",
        country: "United States",
        phone: "+1234567890",
      },
      shipping_method: "standard",
      payment_method: "cash_on_delivery",
      created_at: "2024-01-15T10:30:00.000Z",
      items: [
        {
          id: 1,
          product_id: 1,
          item_name: "iPhone 14 Pro",
          quantity: 2,
          unit_price: 999.99,
          total_price: 1999.98,
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Cart is empty or insufficient stock",
    example: { message: "Cart is empty" },
  })
  @ApiResponse({
    status: 400,
    description: "Guest checkout requires phone and shipping_address",
  })
  @ApiResponse({
    status: 401,
    description: "Provide Authorization or X-Guest-Cart-Id",
  })
  createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    if (req.user) {
      return this.orderService.createOrder(req.user.id, createOrderDto);
    }
    return this.orderService.createGuestOrder(
      req.cartIdentity.guestCartId,
      createOrderDto
    );
  }

  @Get("track")
  @ApiOperation({
    summary: "Track order (guest)",
    description:
      "Get order status by order_number and phone. No auth. For guest orders.",
  })
  @ApiResponse({
    status: 200,
    description: "Order status and items summary",
  })
  @ApiResponse({ status: 404, description: "Order not found" })
  trackOrder(
    @Query("order_number") orderNumber: string,
    @Query("phone") phone: string
  ) {
    return this.orderService.trackOrder(orderNumber, phone);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get my orders",
    description: "Retrieve all orders for the authenticated user",
  })
  @ApiResponse({
    status: 200,
    description: "Orders retrieved successfully",
    example: {
      success: true,
      message: "Orders retrieved successfully",
      data: [
        {
          id: 1,
          order_number: "ORD-2024-000001",
          status: "pending",
          payment_status: "pending",
          total_amount: 2169.96,
          created_at: "2024-01-15T10:30:00.000Z",
          items: [
            {
              id: 1,
              item_name: "iPhone 14 Pro",
              quantity: 2,
              unit_price: 999.99,
              total_price: 1999.98,
            },
          ],
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getMyOrders(@Request() req) {
    return this.orderService.getOrdersByUser(req.user.id);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get order by ID",
    description: "Retrieve detailed information for a specific order",
  })
  @ApiResponse({
    status: 200,
    description: "Order found",
    example: {
      success: true,
      message: "Order retrieved successfully",
      data: {
        id: 1,
        order_number: "ORD-2024-000001",
        user_id: 1,
        status: "pending",
        payment_status: "pending",
        subtotal: 1999.98,
        tax_amount: 159.99,
        shipping_amount: 9.99,
        total_amount: 2169.96,
        shipping_address: {
          first_name: "John",
          last_name: "Doe",
          address_line_1: "123 Main Street",
          city: "New York",
          state: "NY",
          postal_code: "10001",
          country: "United States",
        },
        items: [
          {
            id: 1,
            product_id: 1,
            item_name: "iPhone 14 Pro",
            quantity: 2,
            unit_price: 999.99,
            total_price: 1999.98,
            product: {
              id: 1,
              name: "iPhone 14 Pro",
              images: ["https://..."],
            },
          },
        ],
        payments: [],
        created_at: "2024-01-15T10:30:00.000Z",
        updated_at: "2024-01-15T10:30:00.000Z",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Order not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getOrderById(@Request() req, @Param("id", ParseIntPipe) id: number) {
    return this.orderService.getOrderById(req.user.id, id);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Update order status (Admin)",
    description: "Update the status of an order. Admin only endpoint.",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
          example: "processing",
        },
      },
      required: ["status"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Order status updated successfully",
    example: { message: "Order status updated successfully" },
  })
  @ApiResponse({ status: 404, description: "Order not found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  updateOrderStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: OrderStatus
  ) {
    return this.orderService.updateOrderStatus(id, status);
  }
}
