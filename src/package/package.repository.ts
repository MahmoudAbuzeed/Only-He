import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Package, PackageStatus } from "./entities/package.entity";
import { PackageProduct } from "./entities/package-product.entity";
import { CreatePackageDto } from "./dto/create-package.dto";
import { UpdatePackageDto } from "./dto/update-package.dto";

@Injectable()
export class PackageRepository {
  constructor(
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
    @InjectRepository(PackageProduct)
    private packageProductRepository: Repository<PackageProduct>
  ) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const { products, ...packageData } = createPackageDto;

    // Create the package
    const package_ = this.packageRepository.create(packageData);
    const savedPackage = await this.packageRepository.save(package_);

    // Create package products
    if (products && products.length > 0) {
      const packageProducts = products.map((product) =>
        this.packageProductRepository.create({
          package_id: savedPackage.id,
          product_id: product.product_id,
          quantity: product.quantity,
          unit_price: product.unit_price,
          sort_order: product.sort_order || 0,
        })
      );
      await this.packageProductRepository.save(packageProducts);
    }

    return this.findOne(savedPackage.id);
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    status?: PackageStatus;
    search?: string;
    sort_by?: string;
    sort_order?: "ASC" | "DESC";
  }): Promise<{
    packages: Package[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sort_by = "created_at",
      sort_order = "DESC",
    } = options || {};

    const queryBuilder = this.packageRepository
      .createQueryBuilder("package")
      .leftJoinAndSelect("package.package_products", "packageProducts")
      .leftJoinAndSelect("packageProducts.product", "product");

    if (status) {
      queryBuilder.andWhere("package.status = :status", { status });
    }

    if (search) {
      queryBuilder.andWhere(
        "(package.name ILIKE :search OR package.description ILIKE :search OR package.sku ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    // Add sorting
    const validSortFields = ["name", "price", "created_at", "status"];
    const sortField = validSortFields.includes(sort_by)
      ? sort_by
      : "created_at";
    queryBuilder.orderBy(`package.${sortField}`, sort_order);

    const total = await queryBuilder.getCount();
    const packages = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      packages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findActive(): Promise<Package[]> {
    return this.packageRepository.find({
      where: {
        status: PackageStatus.ACTIVE,
      },
      relations: ["package_products", "package_products.product"],
      order: { created_at: "DESC" },
    });
  }

  async findFeatured(): Promise<Package[]> {
    return this.packageRepository.find({
      where: {
        status: PackageStatus.ACTIVE,
        is_featured: true,
      },
      relations: ["package_products", "package_products.product"],
      order: { created_at: "DESC" },
    });
  }

  async findOne(id: number): Promise<Package> {
    return this.packageRepository.findOne({
      where: { id },
      relations: [
        "package_products",
        "package_products.product",
        "package_products.product.category",
      ],
    });
  }

  async findBySku(sku: string): Promise<Package> {
    return this.packageRepository.findOne({
      where: { sku },
      relations: ["package_products", "package_products.product"],
    });
  }

  async update(
    id: number,
    updatePackageDto: UpdatePackageDto
  ): Promise<Package> {
    const { products, ...packageData } = updatePackageDto;

    // Update package data
    await this.packageRepository.update(id, packageData);

    // If products are provided, update them
    if (products) {
      // Remove existing package products
      await this.packageProductRepository.delete({ package_id: id });

      // Add new package products
      if (products.length > 0) {
        const packageProducts = products.map((product) =>
          this.packageProductRepository.create({
            package_id: id,
            product_id: product.product_id,
            quantity: product.quantity,
            unit_price: product.unit_price,
            sort_order: product.sort_order || 0,
          })
        );
        await this.packageProductRepository.save(packageProducts);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.packageRepository.delete(id);
  }

  async count(): Promise<number> {
    return this.packageRepository.count();
  }

  async countByStatus(status: PackageStatus): Promise<number> {
    return this.packageRepository.count({ where: { status } });
  }

  async updateStatus(id: number, status: PackageStatus): Promise<Package> {
    await this.packageRepository.update(id, { status });
    return this.findOne(id);
  }

  async search(query: string, limit: number = 10): Promise<Package[]> {
    return this.packageRepository
      .createQueryBuilder("package")
      .leftJoinAndSelect("package.package_products", "packageProducts")
      .leftJoinAndSelect("packageProducts.product", "product")
      .where(
        "package.name ILIKE :query OR package.description ILIKE :query OR package.sku ILIKE :query",
        { query: `%${query}%` }
      )
      .andWhere("package.status = :status", { status: PackageStatus.ACTIVE })
      .orderBy("package.created_at", "DESC")
      .limit(limit)
      .getMany();
  }

  // Admin specific methods
  async getPackageAnalytics(id: number): Promise<any> {
    const package_ = await this.findOne(id);
    if (!package_) return null;

    // Get sales data (simplified - you might want to add more complex analytics)
    const totalSold = await this.packageRepository
      .createQueryBuilder("package")
      .leftJoin("package.order_items", "orderItem")
      .select("SUM(orderItem.quantity)", "total_sold")
      .where("package.id = :id", { id })
      .getRawOne();

    const totalRevenue = await this.packageRepository
      .createQueryBuilder("package")
      .leftJoin("package.order_items", "orderItem")
      .select("SUM(orderItem.total_price)", "total_revenue")
      .where("package.id = :id", { id })
      .getRawOne();

    return {
      package_id: id,
      total_sold: parseInt(totalSold.total_sold) || 0,
      total_revenue: parseFloat(totalRevenue.total_revenue) || 0,
      products_count: package_.package_products?.length || 0,
      status: package_.status,
      is_featured: package_.is_featured,
    };
  }
}
