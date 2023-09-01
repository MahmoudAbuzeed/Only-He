import { UserModule } from "./user/user.module";
import { RoleModule } from "./role/role.module";
import { CategoryModule } from "./category/category.module";
import { ProductModule } from "./product/product.module";
import { OrderModule } from "./order/order.module";
import { OrderItemModule } from "./orderItem/order-item.module";

export const modules = [UserModule, RoleModule, CategoryModule, ProductModule, OrderModule, OrderItemModule];
