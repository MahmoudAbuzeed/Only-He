# 📘 Admin Category API - Exact Response Structures

## Base URL
```
https://your-domain.com/api/v1/admin/categories
```

All endpoints require **JWT Bearer Token** with admin permissions.

---

## 1️⃣ Get All Categories

### Endpoint
```http
GET /api/v1/admin/categories
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Items per page |
| `search` | string | No | - | Search by name or description |
| `parent_id` | number/null | No | - | Filter by parent category |
| `is_active` | boolean | No | - | Filter by active status |
| `include_products_count` | boolean | No | true | Include product counts |

### Exact Response
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices and accessories",
      "image_url": "https://example.com/categories/electronics.jpg",
      "is_active": true,
      "sort_order": 0,
      "slug": "electronics",
      "meta_title": "Electronics Category",
      "meta_description": "Browse our electronics collection",
      "parent_id": null,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z",
      "parent": null,
      "children": [
        {
          "id": 2,
          "name": "Laptops",
          "description": "Laptop computers",
          "image_url": "https://example.com/categories/laptops.jpg",
          "is_active": true,
          "sort_order": 1,
          "slug": "laptops",
          "meta_title": null,
          "meta_description": null,
          "parent_id": 1,
          "created_at": "2024-01-15T11:00:00.000Z",
          "updated_at": "2024-01-15T11:00:00.000Z"
        }
      ],
      "products": [
        {
          "id": 1,
          "name": "iPhone 14 Pro",
          "description": "Latest iPhone with advanced features",
          "short_description": "Premium smartphone",
          "sku": "IPH14PRO",
          "price": 999.99,
          "compare_price": 1099.99,
          "cost_price": 750.00,
          "stock_quantity": 50,
          "low_stock_threshold": 10,
          "weight": 0.206,
          "dimensions": "147.5 x 71.5 x 7.85",
          "is_featured": true,
          "manage_stock": true,
          "allow_backorder": false,
          "requires_shipping": true,
          "is_taxable": true,
          "status": "active",
          "images": [
            "https://example.com/products/iphone-1.jpg",
            "https://example.com/products/iphone-2.jpg"
          ],
          "attributes": {
            "color": "Space Black",
            "storage": "256GB",
            "ram": "6GB"
          },
          "category_id": 1,
          "created_at": "2024-01-20T09:00:00.000Z",
          "updated_at": "2024-01-20T09:00:00.000Z"
        }
        // ... more products
      ],
      "products_count": 25
    }
    // ... more categories
  ],
  "total": 10,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

---

## 2️⃣ Get Category by ID

### Endpoint
```http
GET /api/v1/admin/categories/:id
```

### Example
```http
GET /api/v1/admin/categories/1
```

### Exact Response
```json
{
  "id": 1,
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "image_url": "https://example.com/categories/electronics.jpg",
  "is_active": true,
  "sort_order": 0,
  "slug": "electronics",
  "meta_title": "Electronics Category",
  "meta_description": "Browse our electronics collection",
  "parent_id": null,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z",
  "parent": null,
  "children": [
    {
      "id": 2,
      "name": "Laptops",
      "description": "Laptop computers",
      "image_url": "https://example.com/categories/laptops.jpg",
      "is_active": true,
      "sort_order": 1,
      "slug": "laptops",
      "meta_title": null,
      "meta_description": null,
      "parent_id": 1,
      "created_at": "2024-01-15T11:00:00.000Z",
      "updated_at": "2024-01-15T11:00:00.000Z"
    },
    {
      "id": 3,
      "name": "Smartphones",
      "description": "Mobile phones",
      "image_url": "https://example.com/categories/phones.jpg",
      "is_active": true,
      "sort_order": 2,
      "slug": "smartphones",
      "meta_title": null,
      "meta_description": null,
      "parent_id": 1,
      "created_at": "2024-01-15T11:15:00.000Z",
      "updated_at": "2024-01-15T11:15:00.000Z"
    }
  ],
  "products": [
    {
      "id": 1,
      "name": "iPhone 14 Pro",
      "description": "Latest iPhone with advanced features and A16 Bionic chip",
      "short_description": "Premium smartphone with ProMotion display",
      "sku": "IPH14PRO",
      "price": 999.99,
      "compare_price": 1099.99,
      "cost_price": 750.00,
      "stock_quantity": 50,
      "low_stock_threshold": 10,
      "weight": 0.206,
      "dimensions": "147.5 x 71.5 x 7.85 mm",
      "is_featured": true,
      "manage_stock": true,
      "allow_backorder": false,
      "requires_shipping": true,
      "is_taxable": true,
      "status": "active",
      "images": [
        "https://example.com/products/iphone-14-pro-1.jpg",
        "https://example.com/products/iphone-14-pro-2.jpg",
        "https://example.com/products/iphone-14-pro-3.jpg"
      ],
      "attributes": {
        "color": "Space Black",
        "storage": "256GB",
        "ram": "6GB",
        "camera": "48MP",
        "display": "6.1 inch"
      },
      "category_id": 1,
      "created_at": "2024-01-20T09:00:00.000Z",
      "updated_at": "2024-01-25T14:30:00.000Z"
    },
    {
      "id": 2,
      "name": "Samsung Galaxy S23",
      "description": "Flagship Samsung smartphone with amazing camera",
      "short_description": "Android flagship device",
      "sku": "SAMS23",
      "price": 899.99,
      "compare_price": 999.99,
      "cost_price": 650.00,
      "stock_quantity": 30,
      "low_stock_threshold": 10,
      "weight": 0.168,
      "dimensions": "146.3 x 70.9 x 7.6 mm",
      "is_featured": true,
      "manage_stock": true,
      "allow_backorder": false,
      "requires_shipping": true,
      "is_taxable": true,
      "status": "active",
      "images": [
        "https://example.com/products/galaxy-s23-1.jpg",
        "https://example.com/products/galaxy-s23-2.jpg"
      ],
      "attributes": {
        "color": "Phantom Black",
        "storage": "256GB",
        "ram": "8GB",
        "camera": "50MP",
        "display": "6.1 inch"
      },
      "category_id": 1,
      "created_at": "2024-01-21T10:00:00.000Z",
      "updated_at": "2024-01-21T10:00:00.000Z"
    }
    // ... all other products in this category
  ],
  "products_count": 25,
  "subcategories_count": 3
}
```

---

## 3️⃣ Get Category Tree

### Endpoint
```http
GET /api/v1/admin/categories/tree
```

### Exact Response
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices and accessories",
      "image_url": "https://example.com/categories/electronics.jpg",
      "is_active": true,
      "sort_order": 0,
      "slug": "electronics",
      "meta_title": "Electronics Category",
      "meta_description": "Browse our electronics collection",
      "parent_id": null,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z",
      "children": [
        {
          "id": 2,
          "name": "Laptops",
          "description": "Laptop computers",
          "image_url": "https://example.com/categories/laptops.jpg",
          "is_active": true,
          "sort_order": 1,
          "slug": "laptops",
          "parent_id": 1,
          "children": [
            {
              "id": 4,
              "name": "Gaming Laptops",
              "description": "High-performance gaming laptops",
              "image_url": null,
              "is_active": true,
              "sort_order": 0,
              "slug": "gaming-laptops",
              "parent_id": 2,
              "children": []
            },
            {
              "id": 5,
              "name": "Business Laptops",
              "description": "Professional business laptops",
              "image_url": null,
              "is_active": true,
              "sort_order": 1,
              "slug": "business-laptops",
              "parent_id": 2,
              "children": []
            }
          ]
        },
        {
          "id": 3,
          "name": "Smartphones",
          "description": "Mobile phones and accessories",
          "image_url": "https://example.com/categories/phones.jpg",
          "is_active": true,
          "sort_order": 2,
          "slug": "smartphones",
          "parent_id": 1,
          "children": []
        }
      ]
    },
    {
      "id": 6,
      "name": "Clothing",
      "description": "Fashion and apparel",
      "image_url": "https://example.com/categories/clothing.jpg",
      "is_active": true,
      "sort_order": 1,
      "slug": "clothing",
      "parent_id": null,
      "children": [
        {
          "id": 7,
          "name": "Men's Clothing",
          "description": "Men's fashion",
          "image_url": null,
          "is_active": true,
          "sort_order": 0,
          "slug": "mens-clothing",
          "parent_id": 6,
          "children": []
        }
      ]
    }
  ]
}
```

---

## 4️⃣ Get Category Analytics

### Endpoint
```http
GET /api/v1/admin/categories/:id/analytics
```

### Example
```http
GET /api/v1/admin/categories/1/analytics
```

### Exact Response
```json
{
  "category": {
    "id": 1,
    "name": "Electronics"
  },
  "products": {
    "total": 25,
    "active": 23,
    "inactive": 2,
    "total_value": 24500.75
  },
  "subcategories": {
    "total": 3
  },
  "sales": {
    "total_orders": 150,
    "total_revenue": 45000.50,
    "average_order_value": 300.00,
    "top_selling_products": [
      {
        "product_id": 1,
        "product_name": "iPhone 14 Pro",
        "quantity_sold": 45,
        "revenue": 44999.55
      },
      {
        "product_id": 2,
        "product_name": "Samsung Galaxy S23",
        "quantity_sold": 38,
        "revenue": 34199.62
      },
      {
        "product_id": 3,
        "product_name": "MacBook Pro 14",
        "quantity_sold": 22,
        "revenue": 43978.00
      }
    ]
  }
}
```

---

## 5️⃣ Create Category

### Endpoint
```http
POST /api/v1/admin/categories
```

### Request Body
```json
{
  "name": "Gaming",
  "description": "Gaming products and accessories",
  "image_url": "https://example.com/categories/gaming.jpg",
  "is_active": true,
  "sort_order": 5,
  "slug": "gaming",
  "meta_title": "Gaming Products",
  "meta_description": "Browse gaming products",
  "parent_id": 1
}
```

### Exact Response
```json
{
  "message": "CREATED_SUCCESSFULLY",
  "data": {
    "id": 8,
    "name": "Gaming",
    "description": "Gaming products and accessories",
    "image_url": "https://example.com/categories/gaming.jpg",
    "is_active": true,
    "sort_order": 5,
    "slug": "gaming",
    "meta_title": "Gaming Products",
    "meta_description": "Browse gaming products",
    "parent_id": 1,
    "created_at": "2024-01-30T15:45:00.000Z",
    "updated_at": "2024-01-30T15:45:00.000Z"
  }
}
```

---

## 6️⃣ Update Category

### Endpoint
```http
PATCH /api/v1/admin/categories/:id
```

### Request Body (all fields optional)
```json
{
  "name": "Electronics & Gadgets",
  "description": "Updated description",
  "is_active": true,
  "sort_order": 1
}
```

### Exact Response
```json
{
  "message": "UPDATED_SUCCESSFULLY"
}
```

---

## 7️⃣ Delete Category

### Endpoint
```http
DELETE /api/v1/admin/categories/:id?force=false
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `force` | boolean | No | false | Force delete even with products/subcategories |

### Exact Response (Normal Delete)
```json
{
  "message": "DELETED_SUCCESSFULLY",
  "moved_products": 0,
  "moved_subcategories": 0
}
```

### Exact Response (Force Delete)
```json
{
  "message": "DELETED_SUCCESSFULLY",
  "moved_products": 15,
  "moved_subcategories": 2
}
```

---

## 8️⃣ Toggle Category Status

### Endpoint
```http
PATCH /api/v1/admin/categories/:id/toggle-status
```

### Exact Response
```json
{
  "message": "Category status updated successfully",
  "is_active": false,
  "affected_subcategories": 3
}
```

---

## 9️⃣ Move Category

### Endpoint
```http
PATCH /api/v1/admin/categories/:id/move
```

### Request Body
```json
{
  "new_parent_id": 2
}
```

Or to make it a root category:
```json
{
  "new_parent_id": null
}
```

### Exact Response
```json
{
  "message": "Category moved successfully",
  "category_id": 5,
  "new_parent_id": 2
}
```

---

## 📊 Product Object Structure (Full Details)

When products are included in category responses, each product has this structure:

```typescript
{
  id: number;
  name: string;
  description: string;
  short_description: string | null;
  sku: string;
  price: number;                    // Decimal(10,2)
  compare_price: number | null;     // Original price (for discounts)
  cost_price: number | null;        // Cost (for profit calculation)
  stock_quantity: number;
  low_stock_threshold: number;
  weight: number | null;            // In kg
  dimensions: string | null;        // "L x W x H"
  is_featured: boolean;
  manage_stock: boolean;
  allow_backorder: boolean;
  requires_shipping: boolean;
  is_taxable: boolean;
  status: "active" | "inactive" | "out_of_stock" | "discontinued";
  images: string[];                 // Array of image URLs
  attributes: object;               // JSON object with custom attributes
  category_id: number;
  created_at: string;               // ISO 8601 date
  updated_at: string;               // ISO 8601 date
}
```

---

## 🔐 Authentication

All endpoints require a JWT Bearer token with admin permissions:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ❌ Error Responses

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Category not found",
  "error": "Not Found"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Category name already exists",
  "error": "Bad Request"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

---

## 💡 Frontend Integration Tips

### TypeScript Interfaces

```typescript
interface Category {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  slug: string | null;
  meta_title: string | null;
  meta_description: string | null;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
  products_count?: number;
  subcategories_count?: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  short_description: string | null;
  sku: string;
  price: number;
  compare_price: number | null;
  cost_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  weight: number | null;
  dimensions: string | null;
  is_featured: boolean;
  manage_stock: boolean;
  allow_backorder: boolean;
  requires_shipping: boolean;
  is_taxable: boolean;
  status: ProductStatus;
  images: string[];
  attributes: Record<string, any>;
  category_id: number;
  created_at: string;
  updated_at: string;
}

enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock",
  DISCONTINUED = "discontinued"
}

interface CategoryListResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

## 📞 Support

For questions about the API, contact the backend team or refer to the Swagger documentation at:
```
https://your-domain.com/api/docs
```

