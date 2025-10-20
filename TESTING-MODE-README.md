# ⚠️ TESTING MODE - Authentication Disabled

## 🔧 What Was Changed

Authentication has been **temporarily disabled** for user endpoints to allow testing without JWT tokens.

### Modified Controllers

1. **Cart Controller** (`src/cart/cart.controller.ts`)
2. **Order Controller** (`src/order/order.controller.ts`)
3. **Address Controller** (`src/address/address.controller.ts`)

### Changes Made

#### 1. Commented Out Auth Decorator

```typescript
// @ApiBearerAuth("JWT-auth") // ⚠️ DISABLED FOR TESTING - RE-ENABLE IN PRODUCTION
```

#### 2. Added Test User Helper Method

```typescript
// ⚠️ TESTING MODE: Using hardcoded user ID
private getTestUserId(req: any): number {
  return req.user?.id || 1; // Default to user ID 1 for testing
}
```

#### 3. Updated All Methods

All methods now use `this.getTestUserId(req)` instead of `req.user?.id || 1`

---

## ✅ Now You Can Test Without Auth

### Before (Required Auth):

```bash
curl --location --request POST 'https://your-api.com/api/v1/cart/add' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN' \  ← Required
--header 'Content-Type: application/json' \
--data-raw '{"product_id":1,"quantity":1,"item_type":"product"}'
```

### After (No Auth Needed):

```bash
curl --location --request POST 'https://your-api.com/api/v1/cart/add' \
--header 'Content-Type: application/json' \
--data-raw '{"product_id":1,"quantity":1,"item_type":"product"}'
```

---

## 🧪 Test User ID

All requests will use **User ID: 1** by default.

This means:

- Cart operations → User 1's cart
- Orders → User 1's orders
- Addresses → User 1's addresses

---

## 🛡️ What's Still Protected

**Admin endpoints remain fully protected** and still require authentication:

- `/admin/*` - All admin routes
- Uses `AdminGuard` which checks for:
  - Valid JWT token
  - Active user account
  - Admin or Manager role

---

## 🔄 How to Re-Enable Authentication

When you're ready to go back to production mode:

### Step 1: Uncomment Auth Decorators

**Cart Controller:**

```typescript
@ApiTags("Cart")
@ApiBearerAuth("JWT-auth") // ← Uncomment this
@Controller("cart")
```

**Order Controller:**

```typescript
@ApiTags("Orders")
@ApiBearerAuth("JWT-auth") // ← Uncomment this
@Controller("order")
```

**Address Controller:**

```typescript
@ApiTags('Addresses')
@ApiBearerAuth('JWT-auth') // ← Uncomment this
@Controller('addresses')
```

### Step 2: Remove Test Helper (Optional)

You can remove the `getTestUserId()` method and revert to direct usage:

```typescript
const userId = req.user?.id || 1;
```

Or keep it for future testing needs.

### Step 3: Add Authentication Guard

For production, you should add a guard to enforce authentication:

```typescript
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"; // You'll need to create this

@UseGuards(JwtAuthGuard)
@Controller("cart")
export class CartController {
  // ...
}
```

---

## 📝 Testing Endpoints

All user endpoints now work without authentication:

### Cart Endpoints

```bash
# Get cart
GET /cart

# Add to cart
POST /cart/add
{"product_id":1,"quantity":1,"item_type":"product"}

# Increase quantity
PATCH /cart/item/1/increase

# Decrease quantity
PATCH /cart/item/1/decrease

# Remove item
DELETE /cart/item/1

# Clear cart
DELETE /cart/clear
```

### Order Endpoints

```bash
# Create order
POST /order
{
  "shipping_address": {
    "first_name": "John",
    "last_name": "Doe",
    "address_line_1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "United States"
  },
  "shipping_method": "standard",
  "payment_method": "cash_on_delivery"
}

# Get my orders
GET /order

# Get order by ID
GET /order/1
```

### Address Endpoints

```bash
# Get all addresses
GET /addresses

# Create address
POST /addresses
{
  "label": "Home",
  "first_name": "John",
  "last_name": "Doe",
  "address_line_1": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "United States"
}

# Update address
PATCH /addresses/1

# Delete address
DELETE /addresses/1

# Set default shipping
PATCH /addresses/1/set-default-shipping

# Set default billing
PATCH /addresses/1/set-default-billing
```

---

## ⚠️ Important Reminders

1. **This is for TESTING ONLY** - Do NOT deploy to production with auth disabled
2. **All operations use User ID 1** - Data will be mixed for this test user
3. **Admin routes are still protected** - They require proper authentication
4. **Re-enable authentication** before production deployment

---

## 🔒 Production Checklist

Before deploying to production:

- [ ] Uncomment `@ApiBearerAuth("JWT-auth")` in all three controllers
- [ ] Add `@UseGuards(JwtAuthGuard)` to controllers
- [ ] Create proper JWT authentication guard
- [ ] Test with real authentication tokens
- [ ] Verify admin endpoints still work
- [ ] Update API documentation

---

## 📞 Questions?

If you need to:

- Re-enable authentication
- Create a proper auth guard
- Set up different test users
- Deploy to production

Just ask! 🚀
