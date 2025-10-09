# 📘 API Response Structure

## Overview

All mobile API endpoints now follow a **unified response structure** to ensure consistency across the entire application.

---

## 🎯 Standard Response Format

### Success Response

```typescript
{
  "success": true,
  "message": "Operation successful message",
  "data": {
    // Response data here
  },
  "meta": {  // Optional - for pagination or additional info
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### Error Response

```typescript
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": {
    "code": "ERROR_CODE",
    "details": {
      // Additional error details
    }
  }
}
```

---

## 📋 Response Examples

### 1. **User Registration/Login**

#### Success Response

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "user_name": "johndoe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

#### Login Success

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "user_name": "johndoe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. **Firebase Phone Authentication**

#### Existing User Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "isNewUser": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "phone": "+1234567890",
      "first_name": "John",
      "last_name": "Doe",
      "phone_verified": true
    }
  }
}
```

#### New User Response (Requires Registration)

```json
{
  "success": true,
  "message": "Phone verified. Please complete your profile.",
  "data": {
    "isNewUser": true,
    "tempToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Complete Registration Success

```json
{
  "success": true,
  "message": "Registration completed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "phone": "+1234567890",
      "first_name": "Jane",
      "last_name": "Smith",
      "user_name": "janesmith",
      "phone_verified": true
    }
  }
}
```

---

### 3. **Cart Operations**

#### Get Cart

```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": 1,
    "items": [
      {
        "id": 1,
        "product_id": 5,
        "quantity": 2,
        "unit_price": 29.99,
        "total_price": 59.98,
        "product": {
          "id": 5,
          "name": "Product Name",
          "image": "https://..."
        }
      }
    ],
    "subtotal": 59.98,
    "tax_amount": 6.0,
    "shipping_amount": 5.0,
    "discount_amount": 0,
    "total": 70.98,
    "item_count": 2
  }
}
```

#### Add to Cart

```json
{
  "success": true,
  "message": "Item added to cart successfully"
}
```

#### Update Quantity

```json
{
  "success": true,
  "message": "Quantity increased successfully",
  "data": {
    "new_quantity": 3
  }
}
```

#### Empty Cart

```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": null,
    "items": [],
    "subtotal": 0,
    "tax_amount": 0,
    "shipping_amount": 0,
    "discount_amount": 0,
    "total": 0,
    "item_count": 0
  }
}
```

---

### 4. **Product Operations**

#### Get Products (with Pagination)

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "price": 29.99,
      "stock_quantity": 50,
      "images": [...]
    },
    // ... more products
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

#### Get Single Product

```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Product Name",
    "description": "Detailed product description",
    "price": 29.99,
    "sale_price": 24.99,
    "stock_quantity": 50,
    "manage_stock": true,
    "allow_backorder": false,
    "images": [...],
    "category": {...}
  }
}
```

---

### 5. **Update/Delete Operations**

#### Update Success

```json
{
  "success": true,
  "message": "Updated successfully"
}
```

#### Delete Success

```json
{
  "success": true,
  "message": "Deleted successfully"
}
```

---

## 🔧 Using the Response Utility

The `ResponseUtil` class provides helper methods for creating responses:

### In Your Service

```typescript
import { ResponseUtil } from "../common/utils/response.util";

// Success with data
return ResponseUtil.success("Operation successful", userData);

// Success without data
return ResponseUtil.successNoData("Item deleted successfully");

// Paginated response
return ResponseUtil.paginated(
  "Products retrieved successfully",
  products,
  total,
  page,
  limit
);

// Success with metadata
return ResponseUtil.successWithMeta("Data retrieved successfully", data, {
  customMeta: "value",
});
```

---

## 📊 Response Types

### Available Response Types

```typescript
// Standard response
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code?: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: any;
  };
}

// Paginated response
interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

---

## ✅ Benefits

1. **Consistency**: All endpoints return the same structure
2. **Predictability**: Mobile developers always know what to expect
3. **Type Safety**: TypeScript interfaces ensure correct usage
4. **Error Handling**: Standardized error format across the API
5. **Metadata Support**: Easy to add pagination, counts, etc.

---

## 🚀 Migration Guide

### Before (Inconsistent)

```typescript
// Some endpoints returned
return { message: "Success", data: user };

// Others returned
return { ...user, token };

// Others returned
return user;
```

### After (Unified)

```typescript
// All endpoints now return
return ResponseUtil.success("Success message", data);
// or
return ResponseUtil.successNoData("Success message");
```

---

## 📱 Mobile App Usage

### Swift (iOS)

```swift
struct ApiResponse<T: Codable>: Codable {
    let success: Bool
    let message: String
    let data: T?
    let meta: Meta?
}

// Usage
let response = try decoder.decode(ApiResponse<User>.self, from: data)
if response.success {
    if let user = response.data {
        // Handle user data
    }
}
```

### Kotlin (Android)

```kotlin
data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T? = null,
    val meta: Meta? = null
)

// Usage
val response = gson.fromJson(json, ApiResponse::class.java)
if (response.success) {
    response.data?.let { user ->
        // Handle user data
    }
}
```

### React Native / Flutter

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Meta;
}

// Usage
const response: ApiResponse<User> = await api.login(credentials);
if (response.success) {
  const user = response.data;
  // Handle user data
}
```

---

## 🎉 Summary

All mobile endpoints now return a unified response structure, making it easier to:

- Build robust mobile applications
- Handle responses consistently
- Implement type-safe code
- Debug issues quickly
- Maintain the codebase

For any questions or issues, please refer to this document or contact the backend team.
