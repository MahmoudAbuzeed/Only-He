import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { PackageService } from "../../package/package.service";
import { CreatePackageDto } from "../../package/dto/create-package.dto";
import { UpdatePackageDto } from "../../package/dto/update-package.dto";
import { PackageStatus } from "../../package/entities/package.entity";
import { AdminGuard } from "../guards/admin.guard";
import { PermissionsGuard } from "../guards/permissions.guard";
import { RequirePermissions } from "../decorators/permissions.decorator";

@ApiTags("Admin - Package Management")
@ApiBearerAuth("JWT-auth")
@UseGuards(AdminGuard, PermissionsGuard)
@Controller("admin/packages")
export class AdminPackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  @RequirePermissions({ resource: "packages", action: "create" })
  @ApiOperation({
    summary: "Create a new package",
    description: "Create a new product package with multiple products",
  })
  @ApiBody({
    type: CreatePackageDto,
    description: "Package creation data",
    examples: {
      electronics_bundle: {
        summary: "Electronics Bundle Example",
        value: {
          name: "Electronics Bundle",
          description:
            "Complete electronics package with phone and accessories",
          sku: "PKG-ELEC-001",
          price: 1299.99,
          original_price: 1499.99,
          discount_percentage: 13.33,
          image_url: "https://example.com/package-image.jpg",
          status: "active",
          is_featured: true,
          valid_from: "2024-01-01T00:00:00Z",
          valid_until: "2024-12-31T23:59:59Z",
          max_quantity_per_order: 2,
          terms_and_conditions: [
            "Valid for 30 days",
            "No returns on opened items",
          ],
          products: [
            {
              product_id: 1,
              quantity: 1,
              unit_price: 999.99,
              sort_order: 1,
            },
            {
              product_id: 2,
              quantity: 2,
              unit_price: 49.99,
              sort_order: 2,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Package created successfully",
    example: {
      id: 1,
      name: "Electronics Bundle",
      sku: "PKG-ELEC-001",
      price: 1299.99,
      status: "active",
      created_at: "2024-01-15T10:30:00Z",
    },
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @Get()
  @RequirePermissions({ resource: "packages", action: "read" })
  @ApiOperation({
    summary: "Get all packages for admin",
    description:
      "Retrieve all packages with admin-specific information and filtering",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page",
    example: 10,
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search in name, description, or SKU",
  })
  @ApiQuery({
    name: "status",
    required: false,
    enum: PackageStatus,
    description: "Filter by status",
  })
  @ApiQuery({
    name: "sort_by",
    required: false,
    description: "Sort field",
    example: "created_at",
  })
  @ApiQuery({
    name: "sort_order",
    required: false,
    description: "Sort order",
    example: "desc",
  })
  @ApiResponse({
    status: 200,
    description: "Packages retrieved successfully",
    example: {
      packages: [
        {
          id: 1,
          name: "Electronics Bundle",
          sku: "PKG-ELEC-001",
          price: 1299.99,
          status: "active",
          is_featured: true,
          package_products: [
            {
              id: 1,
              quantity: 1,
              unit_price: 999.99,
              product: {
                id: 1,
                name: "iPhone 15",
              },
            },
          ],
          created_at: "2024-01-15T10:30:00Z",
        },
      ],
      total: 25,
      page: 1,
      limit: 10,
      totalPages: 3,
    },
  })
  findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("search") search?: string,
    @Query("status") status?: PackageStatus,
    @Query("sort_by") sort_by?: string,
    @Query("sort_order") sort_order?: "ASC" | "DESC"
  ) {
    return this.packageService.findAll({
      page: page ? parseInt(page.toString()) : 1,
      limit: limit ? parseInt(limit.toString()) : 10,
      search,
      status,
      sort_by,
      sort_order,
    });
  }

  @Get("stats")
  @RequirePermissions({ resource: "packages", action: "read" })
  @ApiOperation({
    summary: "Get package statistics",
    description: "Retrieve package statistics for admin dashboard",
  })
  @ApiResponse({
    status: 200,
    description: "Package statistics retrieved successfully",
    example: {
      total_packages: 25,
      active_packages: 20,
      inactive_packages: 3,
      expired_packages: 2,
      featured_packages: 5,
    },
  })
  getStats() {
    return this.packageService.getPackageStats();
  }

  @Get(":id")
  @RequirePermissions({ resource: "packages", action: "read" })
  @ApiOperation({
    summary: "Get package details for admin",
    description: "Retrieve detailed package information for admin management",
  })
  @ApiParam({ name: "id", description: "Package ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Package found",
    example: {
      id: 1,
      name: "Electronics Bundle",
      description: "Complete electronics package",
      sku: "PKG-ELEC-001",
      price: 1299.99,
      original_price: 1499.99,
      status: "active",
      package_products: [
        {
          id: 1,
          quantity: 1,
          unit_price: 999.99,
          product: {
            id: 1,
            name: "iPhone 15",
            price: 999.99,
          },
        },
      ],
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
    },
  })
  @ApiResponse({ status: 404, description: "Package not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.packageService.findOne(id);
  }

  @Patch(":id")
  @RequirePermissions({ resource: "packages", action: "update" })
  @ApiOperation({
    summary: "Update package",
    description: "Update package information and products",
  })
  @ApiParam({ name: "id", description: "Package ID", example: 1 })
  @ApiBody({
    type: UpdatePackageDto,
    description: "Package update data",
    examples: {
      update_price: {
        summary: "Update Price Example",
        value: {
          price: 1199.99,
          discount_percentage: 20.0,
          status: "active",
        },
      },
      update_products: {
        summary: "Update Products Example",
        value: {
          products: [
            {
              product_id: 1,
              quantity: 1,
              unit_price: 899.99,
              sort_order: 1,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Package updated successfully",
    example: {
      message: "Package updated successfully",
      package: {
        id: 1,
        name: "Electronics Bundle",
        price: 1199.99,
        status: "active",
      },
    },
  })
  @ApiResponse({ status: 404, description: "Package not found" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updatePackageDto: UpdatePackageDto
  ) {
    return this.packageService.update(id, updatePackageDto);
  }

  @Delete(":id")
  @RequirePermissions({ resource: "packages", action: "delete" })
  @ApiOperation({
    summary: "Delete package",
    description: "Delete a package and all its associated data",
  })
  @ApiParam({ name: "id", description: "Package ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Package deleted successfully",
    example: {
      message: "Package deleted successfully",
    },
  })
  @ApiResponse({ status: 404, description: "Package not found" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.packageService.remove(id);
  }

  @Patch(":id/status")
  @RequirePermissions({ resource: "packages", action: "update" })
  @ApiOperation({
    summary: "Update package status",
    description: "Update the status of a package (active, inactive, expired)",
  })
  @ApiParam({ name: "id", description: "Package ID", example: 1 })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["active", "inactive", "expired"],
          example: "active",
        },
      },
      required: ["status"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Package status updated successfully",
    example: {
      id: 1,
      name: "Electronics Bundle",
      status: "active",
      updated_at: "2024-01-15T10:30:00Z",
    },
  })
  @ApiResponse({ status: 404, description: "Package not found" })
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: PackageStatus
  ) {
    return this.packageService.updateStatus(id, status);
  }

  @Get(":id/analytics")
  @RequirePermissions({ resource: "packages", action: "read" })
  @ApiOperation({
    summary: "Get package analytics",
    description: "Retrieve analytics data for a specific package",
  })
  @ApiParam({ name: "id", description: "Package ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Package analytics retrieved successfully",
    example: {
      package_id: 1,
      total_sold: 150,
      total_revenue: 194999.5,
      products_count: 3,
      status: "active",
      is_featured: true,
    },
  })
  @ApiResponse({ status: 404, description: "Package not found" })
  getAnalytics(@Param("id", ParseIntPipe) id: number) {
    return this.packageService.getPackageAnalytics(id);
  }
}
