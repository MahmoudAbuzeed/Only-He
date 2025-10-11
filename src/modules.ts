import { UserModule } from "./user/user.module";
import { RoleModule } from "./role/role.module";
import { CategoryModule } from "./category/category.module";
import { ProductModule } from "./product/product.module";
import { PackageModule } from "./package/package.module";
import { CartModule } from "./cart/cart.module";
import { OrderModule } from "./order/order.module";
import { FavoriteModule } from "./favorite/favorite.module";
import { AdminModule } from "./admin/admin.module";
import { ImagesModule } from "./images/images.module";
import { AddressModule } from "./address/address.module";

export const modules = [
  UserModule,
  RoleModule,
  CategoryModule,
  ProductModule,
  PackageModule,
  CartModule,
  OrderModule,
  FavoriteModule,
  AdminModule,
  ImagesModule,
  AddressModule,
];
