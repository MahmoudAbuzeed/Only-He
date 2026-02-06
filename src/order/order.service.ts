import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";

import { Order, OrderStatus, PaymentStatus } from "./entities/order.entity";
import { OrderItem, OrderItemType } from "./entities/order-item.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { CartService } from "../cart/cart.service";
import { ProductService } from "../product/product.service";
import { AddressService } from "../address/address.service";
import { ErrorHandler } from "shared/errorHandler.service";
import { ResponseUtil } from "../common/utils/response.util";
import { CREATED_SUCCESSFULLY } from "messages";
import { ImagesService } from "../images/images.service";
import { ImageType } from "../images/entities/image.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly addressService: AddressService,
    private readonly errorHandler: ErrorHandler,
    private readonly imagesService: ImagesService
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    try {
      const cartResponse = await this.cartService.getCart({ userId });
      const cart = cartResponse.data;
      if (!cart.items || cart.items.length === 0) {
        throw this.errorHandler.badRequest({ message: "Cart is empty" });
      }

      // Validate stock availability for all items
      for (const cartItem of cart.items) {
        if (cartItem.product) {
          const hasStock = await this.productService.checkStock(
            cartItem.product.id,
            cartItem.quantity
          );
          if (!hasStock) {
            throw this.errorHandler.badRequest({
              message: `Insufficient stock for product: ${cartItem.product.name}`,
            });
          }
        }
      }

      // Resolve shipping address
      let shippingAddress;
      if (createOrderDto.shipping_address_id) {
        // Use saved address
        const savedAddress = await this.addressService.findOneRaw(
          userId,
          createOrderDto.shipping_address_id
        );
        shippingAddress = {
          first_name: savedAddress.first_name,
          last_name: savedAddress.last_name,
          company: savedAddress.company,
          address_line_1: savedAddress.address_line_1,
          address_line_2: savedAddress.address_line_2,
          city: savedAddress.city,
          state: savedAddress.state,
          postal_code: savedAddress.postal_code,
          country: savedAddress.country,
          phone: savedAddress.phone,
        };
      } else if (createOrderDto.shipping_address) {
        // Use provided address
        shippingAddress = createOrderDto.shipping_address;

        // Save address if requested
        if (createOrderDto.save_shipping_address) {
          await this.addressService.create(userId, {
            label: createOrderDto.address_label || "Shipping Address",
            ...createOrderDto.shipping_address,
          });
        }
      } else {
        // Try to use default shipping address
        const defaultAddress =
          await this.addressService.getDefaultShipping(userId);
        if (defaultAddress) {
          shippingAddress = {
            first_name: defaultAddress.first_name,
            last_name: defaultAddress.last_name,
            company: defaultAddress.company,
            address_line_1: defaultAddress.address_line_1,
            address_line_2: defaultAddress.address_line_2,
            city: defaultAddress.city,
            state: defaultAddress.state,
            postal_code: defaultAddress.postal_code,
            country: defaultAddress.country,
            phone: defaultAddress.phone,
          };
        } else {
          throw this.errorHandler.badRequest({
            message: "Shipping address is required",
          });
        }
      }

      // Resolve billing address
      let billingAddress;
      if (createOrderDto.billing_address_id) {
        // Use saved address
        const savedAddress = await this.addressService.findOneRaw(
          userId,
          createOrderDto.billing_address_id
        );
        billingAddress = {
          first_name: savedAddress.first_name,
          last_name: savedAddress.last_name,
          company: savedAddress.company,
          address_line_1: savedAddress.address_line_1,
          address_line_2: savedAddress.address_line_2,
          city: savedAddress.city,
          state: savedAddress.state,
          postal_code: savedAddress.postal_code,
          country: savedAddress.country,
          phone: savedAddress.phone,
        };
      } else if (createOrderDto.billing_address) {
        // Use provided billing address
        billingAddress = createOrderDto.billing_address;
      } else {
        // Default to shipping address
        billingAddress = shippingAddress;
      }

      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Create order
      const order = this.orderRepository.create({
        order_number: orderNumber,
        user_id: userId,
        status: OrderStatus.PENDING,
        payment_status: PaymentStatus.PENDING,
        subtotal: cart.subtotal,
        tax_amount: cart.tax_amount || 0,
        shipping_amount: cart.shipping_amount || 0,
        discount_amount: cart.discount_amount || 0,
        total_amount: cart.total,
        coupon_code: createOrderDto.coupon_code || (cart as any).coupon_code,
        applied_offers: (cart as any).applied_offers || [],
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        shipping_method: createOrderDto.shipping_method,
        notes: createOrderDto.notes,
      });

      const savedOrder = await this.orderRepository.save(order);

      // Create order items
      for (const cartItem of cart.items) {
        const orderItem = this.orderItemRepository.create({
          order_id: savedOrder.id,
          item_type: cartItem.item_type as OrderItemType,
          product_id: cartItem.product_id,
          package_id: cartItem.package_id,
          quantity: cartItem.quantity,
          unit_price: cartItem.unit_price,
          total_price: cartItem.total_price,
          item_name:
            cartItem.product?.name || cartItem.package?.name || "Unknown Item",
          item_sku: cartItem.product?.sku || cartItem.package?.sku,
          item_details: {
            description:
              cartItem.product?.description || cartItem.package?.description,
            image_url:
              cartItem.product?.images?.[0] || cartItem.package?.image_url,
            attributes: cartItem.product?.attributes,
          },
          product_options: cartItem.product_options,
          applied_discounts: cartItem.applied_discounts,
        });

        await this.orderItemRepository.save(orderItem);

        // Reserve stock for products
        if (cartItem.product) {
          await this.productService.reserveStock(
            cartItem.product.id,
            cartItem.quantity
          );
        }
      }

      await this.cartService.clearCart({ userId });

      return {
        message: CREATED_SUCCESSFULLY,
        data: {
          order_id: savedOrder.id,
          order_number: savedOrder.order_number,
          total_amount: savedOrder.total_amount,
        },
      };
    } catch (error) {
      if (error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async createGuestOrder(guestCartId: string, createOrderDto: CreateOrderDto) {
    try {
      const cartResponse = await this.cartService.getCart({ guestCartId });
      const cart = cartResponse.data;
      if (!cart.items || cart.items.length === 0) {
        throw this.errorHandler.badRequest({ message: "Cart is empty" });
      }

      const phone =
        createOrderDto.phone?.trim() ||
        createOrderDto.shipping_address?.phone?.trim();
      if (!phone) {
        throw this.errorHandler.badRequest({
          message: "Phone number is required for guest checkout",
        });
      }
      if (!createOrderDto.shipping_address) {
        throw this.errorHandler.badRequest({
          message: "Shipping address is required for guest checkout",
        });
      }

      for (const cartItem of cart.items) {
        if (cartItem.product) {
          const hasStock = await this.productService.checkStock(
            cartItem.product.id,
            cartItem.quantity
          );
          if (!hasStock) {
            throw this.errorHandler.badRequest({
              message: `Insufficient stock for product: ${cartItem.product.name}`,
            });
          }
        }
      }

      const shippingAddress = {
        ...createOrderDto.shipping_address,
        phone: createOrderDto.shipping_address.phone || phone,
      };
      const billingAddress =
        createOrderDto.billing_address || shippingAddress;

      const orderNumber = await this.generateOrderNumber();

      const order = this.orderRepository.create({
        order_number: orderNumber,
        user_id: null,
        guest_phone: phone,
        status: OrderStatus.PENDING,
        payment_status: PaymentStatus.PENDING,
        subtotal: cart.subtotal,
        tax_amount: cart.tax_amount || 0,
        shipping_amount: cart.shipping_amount || 0,
        discount_amount: cart.discount_amount || 0,
        total_amount: cart.total,
        coupon_code: createOrderDto.coupon_code || (cart as any).coupon_code,
        applied_offers: (cart as any).applied_offers || [],
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        shipping_method: createOrderDto.shipping_method,
        notes: createOrderDto.notes,
      });

      const savedOrder = await this.orderRepository.save(order);

      for (const cartItem of cart.items) {
        const orderItem = this.orderItemRepository.create({
          order_id: savedOrder.id,
          item_type: cartItem.item_type as OrderItemType,
          product_id: cartItem.product_id,
          package_id: cartItem.package_id,
          quantity: cartItem.quantity,
          unit_price: cartItem.unit_price,
          total_price: cartItem.total_price,
          item_name:
            cartItem.product?.name || cartItem.package?.name || "Unknown Item",
          item_sku: cartItem.product?.sku || cartItem.package?.sku,
          item_details: {
            description:
              cartItem.product?.description || cartItem.package?.description,
            image_url:
              cartItem.product?.images?.[0] || cartItem.package?.image_url,
            attributes: cartItem.product?.attributes,
          },
          product_options: cartItem.product_options,
          applied_discounts: cartItem.applied_discounts,
        });
        await this.orderItemRepository.save(orderItem);
        if (cartItem.product) {
          await this.productService.reserveStock(
            cartItem.product.id,
            cartItem.quantity
          );
        }
      }

      await this.cartService.clearCartByCartId(cart.id);

      return {
        message: CREATED_SUCCESSFULLY,
        data: {
          order_id: savedOrder.id,
          order_number: savedOrder.order_number,
          total_amount: savedOrder.total_amount,
        },
      };
    } catch (error) {
      if (error.status === 400) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async getOrdersByUser(userId: number) {
    try {
      const orders = await this.orderRepository.find({
        where: { user_id: userId },
        relations: ["items", "items.product", "items.package"],
        order: { created_at: "DESC" },
      });

      // Include images in order items
      const ordersWithImages = await Promise.all(
        orders.map(async (order) => ({
          ...order,
          items: await this.includeImagesInOrderItems(order.items || []),
        }))
      );

      return ResponseUtil.success("Orders retrieved successfully", ordersWithImages);
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async getOrderById(userId: number, orderId: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId, user_id: userId },
        relations: ["items", "items.product", "items.package", "payments"],
      });

      if (!order) {
        throw this.errorHandler.notFound({ message: "Order not found" });
      }

      // Include images in order items
      const orderWithImages = {
        ...order,
        items: await this.includeImagesInOrderItems(order.items || []),
      };

      return ResponseUtil.success("Order retrieved successfully", orderWithImages);
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async updateOrderStatus(orderId: number, status: OrderStatus) {
    try {
      const result = await this.orderRepository.update(orderId, { status });
      if (result.affected === 0) {
        throw this.errorHandler.notFound({ message: "Order not found" });
      }
      return ResponseUtil.success("Order status updated successfully");
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  /**
   * Public order tracking by order_number + phone (for guest orders).
   * Returns minimal status and items; no auth required.
   */
  async trackOrder(orderNumber: string, phone: string) {
    try {
      const normalizedPhone = phone?.trim();
      if (!orderNumber?.trim() || !normalizedPhone) {
        throw this.errorHandler.badRequest({
          message: "order_number and phone are required",
        });
      }
      const order = await this.orderRepository.findOne({
        where: { order_number: orderNumber.trim() },
        relations: ["items", "items.product"],
      });
      if (!order) {
        throw this.errorHandler.notFound({ message: "Order not found" });
      }
      const matchPhone =
        order.guest_phone?.trim() ||
        (order.shipping_address as any)?.phone?.trim();
      if (!matchPhone || matchPhone !== normalizedPhone) {
        throw this.errorHandler.notFound({ message: "Order not found" });
      }
      const safeOrder = {
        order_number: order.order_number,
        status: order.status,
        total_amount: order.total_amount,
        created_at: order.created_at,
        items: (order.items || []).map((item) => ({
          item_name: item.item_name,
          quantity: item.quantity,
          total_price: item.total_price,
        })),
      };
      return ResponseUtil.success("Order retrieved successfully", safeOrder);
    } catch (error) {
      if (error.status === 400 || error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.orderRepository.count();
    const orderNumber = `ORD-${year}-${String(count + 1).padStart(6, "0")}`;
    return orderNumber;
  }

  // Methods for admin user statistics
  async countByUser(userId: number): Promise<number> {
    try {
      return await this.orderRepository.count({ where: { user_id: userId } });
    } catch (error) {
      return 0;
    }
  }

  async getTotalSpentByUser(userId: number): Promise<number> {
    try {
      const result = await this.orderRepository.sum("total_amount", {
        user_id: userId,
        status: Not(OrderStatus.CANCELLED),
      });

      return result || 0;
    } catch (error) {
      return 0;
    }
  }

  async getLastOrderDate(userId: number): Promise<Date | null> {
    try {
      const order = await this.orderRepository.findOne({
        where: { user_id: userId },
        order: { created_at: "DESC" },
        select: ["created_at"],
      });

      return order ? order.created_at : null;
    } catch (error) {
      return null;
    }
  }

  private async includeImagesInOrderItems(orderItems: any[]): Promise<any[]> {
    if (!orderItems || orderItems.length === 0) {
      return orderItems;
    }

    // Extract product IDs from order items
    const productIds = orderItems
      .filter((item) => item.product && item.product.id)
      .map((item) => item.product.id);

    if (productIds.length === 0) {
      return orderItems;
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

    // Add images to each order item's product
    return orderItems.map((item) => {
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
