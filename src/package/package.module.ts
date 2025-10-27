import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PackageService } from "./package.service";
import { PackageController } from "./package.controller";
import { PackageRepository } from "./repositories/package.repository";
import { Package } from "./entities/package.entity";
import { PackageProduct } from "./entities/package-product.entity";
import { ImagesModule } from "../images/images.module";
import { ErrorHandler } from "shared/errorHandler.service";

@Module({
  imports: [TypeOrmModule.forFeature([Package, PackageProduct]), ImagesModule],
  controllers: [PackageController],
  providers: [PackageService, PackageRepository, ErrorHandler],
  exports: [PackageService, PackageRepository],
})
export class PackageModule {}
