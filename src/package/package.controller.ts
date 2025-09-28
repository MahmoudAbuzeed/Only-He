import { Controller, Get, Param, Query, ParseIntPipe } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { PackageService } from "./package.service";
import { PackageStatus } from "./entities/package.entity";

@ApiTags("Packages")
@Controller("package")
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get()
  @ApiOperation({
    summary: "Get all packages",
    description: "Retrieve all packages with pagination and filtering options",
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
    name: "status",
    required: false,
    enum: PackageStatus,
    description: "Filter by status",
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search in name, description, or SKU",
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
          description:
            "Complete electronics package with phone and accessories",
          sku: "PKG-ELEC-001",
          price: 1299.99,
          original_price: 1499.99,
          discount_percentage: 13.33,
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
                price: 999.99,
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
    @Query("status") status?: PackageStatus,
    @Query("search") search?: string,
    @Query("sort_by") sort_by?: string,
    @Query("sort_order") sort_order?: "ASC" | "DESC"
  ) {
    return this.packageService.findAll({
      page: page ? parseInt(page.toString()) : 1,
      limit: limit ? parseInt(limit.toString()) : 10,
      status,
      search,
      sort_by,
      sort_order,
    });
  }

  @Get("active")
  @ApiOperation({
    summary: "Get active packages",
    description: "Retrieve only active packages",
  })
  @ApiResponse({
    status: 200,
    description: "Active packages retrieved successfully",
    example: [
      {
        id: 1,
        name: "Electronics Bundle",
        price: 1299.99,
        status: "active",
        package_products: [],
      },
    ],
  })
  findActive() {
    return this.packageService.findActive();
  }

  @Get("featured")
  @ApiOperation({
    summary: "Get featured packages",
    description: "Retrieve featured packages for homepage or promotions",
  })
  @ApiResponse({
    status: 200,
    description: "Featured packages retrieved successfully",
    example: [
      {
        id: 1,
        name: "Electronics Bundle",
        price: 1299.99,
        is_featured: true,
        package_products: [],
      },
    ],
  })
  findFeatured() {
    return this.packageService.findFeatured();
  }

  @Get("search")
  @ApiOperation({
    summary: "Search packages",
    description: "Search packages by name, description, or SKU",
  })
  @ApiQuery({
    name: "q",
    required: true,
    description: "Search query",
    example: "electronics",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Maximum results",
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: "Search results",
    example: [
      {
        id: 1,
        name: "Electronics Bundle",
        description: "Complete electronics package",
        price: 1299.99,
        package_products: [],
      },
    ],
  })
  search(@Query("q") query: string, @Query("limit") limit?: number) {
    return this.packageService.search(
      query,
      limit ? parseInt(limit.toString()) : 10
    );
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get package by ID",
    description: "Retrieve detailed package information including products",
  })
  @ApiParam({ name: "id", description: "Package ID", example: 1 })
  @ApiResponse({
    status: 200,
    description: "Package found",
    example: {
      id: 1,
      name: "Electronics Bundle",
      description: "Complete electronics package with phone and accessories",
      sku: "PKG-ELEC-001",
      price: 1299.99,
      original_price: 1499.99,
      discount_percentage: 13.33,
      status: "active",
      is_featured: true,
      valid_from: "2024-01-01T00:00:00Z",
      valid_until: "2024-12-31T23:59:59Z",
      terms_and_conditions: ["Valid for 30 days", "No returns on opened items"],
      package_products: [
        {
          id: 1,
          quantity: 1,
          unit_price: 999.99,
          product: {
            id: 1,
            name: "iPhone 15",
            price: 999.99,
            images: ["image1.jpg"],
            category: {
              id: 1,
              name: "Smartphones",
            },
          },
        },
      ],
      created_at: "2024-01-15T10:30:00Z",
    },
  })
  @ApiResponse({ status: 404, description: "Package not found" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.packageService.findOne(id);
  }

  @Get("sku/:sku")
  @ApiOperation({
    summary: "Get package by SKU",
    description: "Retrieve package information by SKU",
  })
  @ApiParam({
    name: "sku",
    description: "Package SKU",
    example: "PKG-ELEC-001",
  })
  @ApiResponse({
    status: 200,
    description: "Package found",
    example: {
      id: 1,
      name: "Electronics Bundle",
      sku: "PKG-ELEC-001",
      price: 1299.99,
      package_products: [],
    },
  })
  @ApiResponse({ status: 404, description: "Package not found" })
  findBySku(@Param("sku") sku: string) {
    return this.packageService.findBySku(sku);
  }
}
