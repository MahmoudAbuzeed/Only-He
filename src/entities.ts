import { OrderItem } from "./orderItem/entities/order-item.entity";
import { Category } from "./category/entities/category.entity";
import { Product } from "./product/entities/product.entity";
import { Order } from "./order/entities/order.entity";
import { User } from "./user/entities/user.entity";
import { Role } from "./role/entities/role.entity";

export const entities = [User, Role, Category, Product, Order, OrderItem];
