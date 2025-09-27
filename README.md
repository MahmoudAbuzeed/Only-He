# Only-He E-Commerce API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<p align="center">
  A comprehensive e-commerce API built with NestJS, TypeScript, PostgreSQL, and Docker
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-10.3.0-red.svg" alt="NestJS Version" />
  <img src="https://img.shields.io/badge/TypeScript-5.3.2-blue.svg" alt="TypeScript Version" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-blue.svg" alt="PostgreSQL Version" />
  <img src="https://img.shields.io/badge/Docker-Ready-green.svg" alt="Docker Ready" />
</p>

## 🚀 Features

### 📱 **Mobile-Ready API**

- **User Authentication**: Register/Login with email or phone number
- **Product Catalog**: Browse categories, products, and detailed product information
- **Shopping Cart**: Add, remove, update quantities with real-time calculations
- **Order Management**: Place orders with cash-on-delivery payment
- **Favorites/Wishlist**: Save and manage favorite products
- **JWT Authentication**: Secure token-based authentication

### 🛠️ **Admin Management System**

- **User Management**: Create, update, delete users with role assignments
- **Product Management**: Full CRUD operations with inventory tracking
- **Category Management**: Hierarchical category structure with analytics
- **Order Management**: Track orders, update status, and generate reports
- **Dashboard Analytics**: Real-time business metrics and system health
- **Role-Based Access Control**: Granular permissions system

### 🔧 **Technical Features**

- **RESTful API**: Clean, consistent API design
- **Swagger Documentation**: Interactive API documentation
- **Database Integration**: PostgreSQL with TypeORM
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Structured error responses
- **Logging**: Request/response logging with Winston
- **Docker Support**: Containerized development environment

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Only-He
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=only_he_db

# Application Configuration
NODE_ENV=development
PORT=3002

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

### 4. Start the Database

```bash
docker-compose up -d postgres
```

### 5. Run the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod
```

## 🌐 API Access

Once the application is running, you can access:

- **API Base URL**: `http://localhost:3002/api/v1`
- **Swagger Documentation**: `http://localhost:3002/api/docs`
- **Health Check**: `http://localhost:3002/api/v1`

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/v1/user          # Register user
POST /api/v1/user/signIn   # Login user
```

### Product Catalog

```
GET  /api/v1/category                    # Get all categories
GET  /api/v1/category/:id/products       # Get products by category
GET  /api/v1/product                     # Get all products (paginated)
GET  /api/v1/product/:id                 # Get product details
GET  /api/v1/product/category/:categoryId # Get products by category
```

### Shopping Cart

```
GET    /api/v1/cart                      # Get user's cart
POST   /api/v1/cart/add                  # Add item to cart
PATCH  /api/v1/cart/item/:itemId/increase # Increase quantity
PATCH  /api/v1/cart/item/:itemId/decrease # Decrease quantity
DELETE /api/v1/cart/item/:itemId         # Remove item from cart
DELETE /api/v1/cart/clear                # Clear entire cart
```

### Orders

```
POST  /api/v1/order           # Place new order
GET   /api/v1/order           # Get user's orders
GET   /api/v1/order/:id       # Get order details
PATCH /api/v1/order/:id/status # Update order status
```

### Favorites

```
GET    /api/v1/favorite                # Get user's favorites
POST   /api/v1/favorite/toggle/:productId # Toggle favorite status
DELETE /api/v1/favorite/:productId     # Remove from favorites
```

### Admin Endpoints

```
# User Management
GET    /api/v1/admin/users             # Get all users
POST   /api/v1/admin/users             # Create user
GET    /api/v1/admin/users/:id         # Get user details
PATCH  /api/v1/admin/users/:id         # Update user
DELETE /api/v1/admin/users/:id         # Delete user

# Product Management
GET    /api/v1/admin/products          # Get all products
POST   /api/v1/admin/products          # Create product
PATCH  /api/v1/admin/products/:id      # Update product
DELETE /api/v1/admin/products/:id      # Delete product

# Dashboard & Analytics
GET    /api/v1/admin/dashboard/overview      # Dashboard overview
GET    /api/v1/admin/dashboard/sales-analytics # Sales analytics
GET    /api/v1/admin/dashboard/system-health  # System health
```

## 🏗️ Project Structure

```
src/
├── admin/                 # Admin management system
│   ├── controllers/       # Admin controllers
│   ├── services/         # Admin business logic
│   ├── dto/              # Admin DTOs
│   └── guards/           # Admin guards & decorators
├── user/                 # User management
├── product/              # Product catalog
├── category/             # Category management
├── cart/                 # Shopping cart
├── order/                # Order management
├── favorite/             # Favorites/Wishlist
├── role/                 # Role-based access control
├── shared/               # Shared utilities
│   ├── logger/           # Logging service
│   └── errorHandler.service.ts
├── entities.ts           # Database entities
├── modules.ts            # Application modules
├── app.module.ts         # Main application module
└── main.ts              # Application entry point
```

## 🐳 Docker Development

### Start All Services

```bash
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f nest-app
docker-compose logs -f postgres
```

### Stop Services

```bash
docker-compose down
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: User accounts with authentication
- **Roles**: Role-based permissions system
- **Categories**: Hierarchical product categories
- **Products**: Product catalog with inventory
- **Cart & CartItems**: Shopping cart functionality
- **Orders & OrderItems**: Order management
- **Favorites**: User wishlist
- **Payments**: Payment tracking

## 🔒 Authentication & Authorization

- **JWT Tokens**: Secure authentication with configurable expiration
- **Role-Based Access**: Admin, Customer, Manager, Staff roles
- **Permission System**: Granular permissions for different operations
- **Guards**: Route protection with custom decorators

## 🚀 Deployment

### Production Environment Variables

```env
NODE_ENV=production
DATABASE_HOST=your-production-db-host
DATABASE_PASSWORD=secure-production-password
JWT_SECRET=super-secure-production-secret
```

### Build for Production

```bash
npm run build
npm run start:prod
```

## 📈 Monitoring & Health Checks

- **Health Endpoint**: `/api/v1` for basic health check
- **System Health**: `/api/v1/admin/dashboard/system-health` for detailed metrics
- **Database Health**: Automatic connection monitoring
- **Error Tracking**: Comprehensive error logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

- **Swagger UI**: `http://localhost:3002/api/docs` - Interactive API documentation
- **Setup Guide**: See [SETUP.md](SETUP.md) for detailed setup instructions
- **Architecture**: Well-documented codebase with TypeScript interfaces

## 🔄 Recent Updates

- ✅ Upgraded to NestJS 10.3.0 and TypeScript 5.3.2
- ✅ Migrated from MySQL to PostgreSQL
- ✅ Implemented comprehensive admin system
- ✅ Added Swagger API documentation
- ✅ Enhanced cart functionality with quantity management
- ✅ Added favorites/wishlist feature
- ✅ Implemented real-time analytics and dashboard
- ✅ Added role-based access control
- ✅ Comprehensive error handling and validation

---

**Built with ❤️ using NestJS, TypeScript, and PostgreSQL**
