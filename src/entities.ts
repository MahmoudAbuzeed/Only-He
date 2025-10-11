import { User } from "./user/entities/user.entity";
import { Role } from "./role/entities/role.entity";
import { Category } from "./category/entities/category.entity";
import { Product } from "./product/entities/product.entity";
import { Package } from "./package/entities/package.entity";
import { PackageProduct } from "./package/entities/package-product.entity";
import { Offer } from "./offer/entities/offer.entity";
import { Cart } from "./cart/entities/cart.entity";
import { CartItem } from "./cart/entities/cart-item.entity";
import { Order } from "./order/entities/order.entity";
import { OrderItem } from "./order/entities/order-item.entity";
import { Payment } from "./payment/entities/payment.entity";
import { Favorite } from "./favorite/entities/favorite.entity";
import { Image } from "./images/entities/image.entity";
import { Address } from "./address/entities/address.entity";

export const entities = [
  User,
  Role,
  Category,
  Product,
  Package,
  PackageProduct,
  Offer,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Favorite,
  Image,
  Address,
];
