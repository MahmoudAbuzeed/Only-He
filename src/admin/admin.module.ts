import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { AdminUserController } from "./controllers/admin-user.controller";
import { AdminProductController } from "./controllers/admin-product.controller";
import { AdminCategoryController } from "./controllers/admin-category.controller";
import { AdminOrderController } from "./controllers/admin-order.controller";
import { AdminDashboardController } from "./controllers/admin-dashboard.controller";
import { AdminPackageController } from "./controllers/admin-package.controller";

import { AdminUserService } from "./services/admin-user.service";
import { AdminProductService } from "./services/admin-product.service";
import { AdminCategoryService } from "./services/admin-category.service";
import { AdminOrderService } from "./services/admin-order.service";
import { AdminDashboardService } from "./services/admin-dashboard.service";

import { UserModule } from "../user/user.module";
import { RoleModule } from "../role/role.module";
import { ProductModule } from "../product/product.module";
import { PackageModule } from "../package/package.module";
import { CategoryModule } from "../category/category.module";
import { OrderModule } from "../order/order.module";
import { CartModule } from "../cart/cart.module";
import { FavoriteModule } from "../favorite/favorite.module";
import { ErrorHandler } from "shared/errorHandler.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { User } from "../user/entities/user.entity";
import { Order } from "../order/entities/order.entity";
import { OrderItem } from "../order/entities/order-item.entity";
import { Product } from "../product/entities/product.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, OrderItem, Product]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "default-secret-key",
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    }),
    UserModule,
    RoleModule,
    ProductModule,
    PackageModule,
    CategoryModule,
    OrderModule,
    CartModule,
    FavoriteModule,
  ],
  controllers: [
    AdminController,
    AdminUserController,
    AdminProductController,
    AdminCategoryController,
    AdminOrderController,
    AdminDashboardController,
    AdminPackageController,
  ],
  providers: [
    AdminService,
    AdminUserService,
    AdminProductService,
    AdminCategoryService,
    AdminOrderService,
    AdminDashboardService,
    ErrorHandler,
  ],
  exports: [AdminService],
})
export class AdminModule {}
