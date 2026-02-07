import { Injectable } from "@nestjs/common";
import { PackageRepository } from "./repositories/package.repository";
import { CreatePackageDto } from "./dto/create-package.dto";
import { UpdatePackageDto } from "./dto/update-package.dto";
import { Package, PackageStatus } from "./entities/package.entity";
import { ErrorHandler } from "shared/errorHandler.service";
import { ImagesService } from "../images/images.service";
import { ImageType } from "../images/entities/image.entity";

@Injectable()
export class PackageService {
  constructor(
    private readonly packageRepository: PackageRepository,
    private readonly errorHandler: ErrorHandler,
    private readonly imagesService: ImagesService
  ) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    try {
      // Check if SKU already exists
      const existingPackage = await this.packageRepository.findBySku(
        createPackageDto.sku
      );
      if (existingPackage) {
        throw this.errorHandler.badRequest({
          message: "Package with this SKU already exists",
        });
      }

      return await this.packageRepository.create(createPackageDto);
    } catch (error) {
      if (error.status) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: PackageStatus;
    search?: string;
    sort_by?: string;
    sort_order?: "ASC" | "DESC";
  }) {
    try {
      return await this.packageRepository.findAll(options);
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findActive(): Promise<Package[]> {
    try {
      return await this.packageRepository.findActive();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findFeatured(): Promise<Package[]> {
    try {
      return await this.packageRepository.findFeatured();
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async findOne(id: number): Promise<Package> {
    try {
      const package_ = await this.packageRepository.findOne(id);
      if (!package_) {
        throw this.errorHandler.notFound({ message: "Package not found" });
      }

      // Include images in package products
      if (package_.package_products && package_.package_products.length > 0) {
        package_.package_products = await this.includeImagesInPackageProducts(
          package_.package_products
        );
      }

      return package_;
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async findBySku(sku: string): Promise<Package> {
    try {
      const package_ = await this.packageRepository.findBySku(sku);
      if (!package_) {
        throw this.errorHandler.notFound({ message: "Package not found" });
      }
      return package_;
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async update(
    id: number,
    updatePackageDto: UpdatePackageDto
  ): Promise<Package> {
    try {
      const existingPackage = await this.packageRepository.findOne(id);
      if (!existingPackage) {
        throw this.errorHandler.notFound({ message: "Package not found" });
      }

      // Check if SKU is being updated and if it conflicts with another package
      if (
        updatePackageDto.sku &&
        updatePackageDto.sku !== existingPackage.sku
      ) {
        const packageWithSku = await this.packageRepository.findBySku(
          updatePackageDto.sku
        );
        if (packageWithSku && packageWithSku.id !== id) {
          throw this.errorHandler.badRequest({
            message: "Package with this SKU already exists",
          });
        }
      }

      return await this.packageRepository.update(id, updatePackageDto);
    } catch (error) {
      if (error.status) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const package_ = await this.packageRepository.findOne(id);
      if (!package_) {
        throw this.errorHandler.notFound({ message: "Package not found" });
      }

      await this.packageRepository.remove(id);
      return { message: "Package deleted successfully" };
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async updateStatus(id: number, status: PackageStatus): Promise<Package> {
    try {
      const package_ = await this.packageRepository.findOne(id);
      if (!package_) {
        throw this.errorHandler.notFound({ message: "Package not found" });
      }

      return await this.packageRepository.updateStatus(id, status);
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  async toggleStatus(id: number): Promise<Package> {
    const package_ = await this.packageRepository.findOne(id);
    if (!package_) {
      throw this.errorHandler.notFound({ message: "Package not found" });
    }
    const newStatus =
      package_.status === PackageStatus.ACTIVE ? PackageStatus.INACTIVE : PackageStatus.ACTIVE;
    return await this.packageRepository.updateStatus(id, newStatus);
  }

  async search(query: string, limit: number = 10): Promise<Package[]> {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }
      return await this.packageRepository.search(query.trim(), limit);
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  async getPackageAnalytics(id: number) {
    try {
      const analytics = await this.packageRepository.getPackageAnalytics(id);
      if (!analytics) {
        throw this.errorHandler.notFound({ message: "Package not found" });
      }
      return analytics;
    } catch (error) {
      if (error.status === 404) throw error;
      throw this.errorHandler.badRequest(error);
    }
  }

  // Helper methods for statistics
  async getPackageStats() {
    try {
      const [
        totalPackages,
        activePackages,
        inactivePackages,
        expiredPackages,
        featuredPackages,
      ] = await Promise.all([
        this.packageRepository.count(),
        this.packageRepository.countByStatus(PackageStatus.ACTIVE),
        this.packageRepository.countByStatus(PackageStatus.INACTIVE),
        this.packageRepository.countByStatus(PackageStatus.EXPIRED),
        this.packageRepository
          .findFeatured()
          .then((packages) => packages.length),
      ]);

      return {
        total_packages: totalPackages,
        active_packages: activePackages,
        inactive_packages: inactivePackages,
        expired_packages: expiredPackages,
        featured_packages: featuredPackages,
      };
    } catch (error) {
      throw this.errorHandler.badRequest(error);
    }
  }

  private async includeImagesInPackageProducts(
    packageProducts: any[]
  ): Promise<any[]> {
    if (!packageProducts || packageProducts.length === 0) {
      return packageProducts;
    }

    // Extract product IDs from package products
    const productIds = packageProducts
      .filter((pp) => pp.product && pp.product.id)
      .map((pp) => pp.product.id);

    if (productIds.length === 0) {
      return packageProducts;
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

    // Add images to each package product's product
    return packageProducts.map((pp) => {
      if (pp.product && pp.product.id) {
        return {
          ...pp,
          product: {
            ...pp.product,
            images: this.imagesService.formatImagesForResponse(
              imagesMap[pp.product.id] || []
            ),
            primary_image: this.imagesService.formatImageForResponse(
              primaryImagesMap[pp.product.id]
            ),
          },
        };
      }
      return pp;
    });
  }
}
