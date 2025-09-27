# Only-He E-Commerce API Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Docker & Docker Compose (optional)

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Only-He
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your database credentials
# Required variables:
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=only_he_db
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d postgres

# The database will be available at localhost:5432
```

#### Option B: Local PostgreSQL
```bash
# Create database manually
createdb only_he_db

# Or using psql
psql -U postgres -c "CREATE DATABASE only_he_db;"
```

### 4. Run the Application
```bash
# Development mode (with hot reload)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

### 5. Access the Application
- **API Base URL**: http://localhost:3002/api/v1
- **Swagger Documentation**: http://localhost:3002/api/docs
- **Health Check**: http://localhost:3002/api/v1/health

## 📚 API Documentation

### Swagger UI
Visit http://localhost:3002/api/docs for interactive API documentation with:
- All endpoints documented
- Request/response schemas
- Try-it-out functionality
- Authentication examples

### Available Modules
- **Authentication**: User registration, login, JWT tokens
- **Users**: User management and profiles
- **Products**: Product catalog with categories
- **Cart**: Shopping cart functionality
- **Orders**: Order management and checkout
- **Favorites**: Wishlist functionality
- **Admin**: Administrative operations with RBAC

## 🔧 Development

### Available Scripts
```bash
npm run start:dev     # Development with hot reload
npm run build         # Build for production
npm run start:prod    # Run production build
npm run lint          # Run ESLint
npm run test          # Run tests
npm run test:watch    # Run tests in watch mode
```

### Database Migration
The application uses TypeORM with `synchronize: true` in development, which automatically creates/updates database schema.

**⚠️ Important**: Set `synchronize: false` in production and use proper migrations.

## 🐳 Docker Deployment

### Full Stack with Docker Compose
```bash
# Start all services (PostgreSQL + API)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables for Docker
```env
NODE_ENV=production
DATABASE_HOST=postgres  # Docker service name
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=only_he_db
```

## 🔐 Authentication

### JWT Token Usage
```bash
# Register a new user
POST /api/v1/user
{
  "first_name": "John",
  "last_name": "Doe",
  "user_name": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}

# Login
POST /api/v1/user/signIn
{
  "email": "john@example.com",
  "password": "securePassword123"
}

# Use the returned token in subsequent requests
Authorization: Bearer <your-jwt-token>
```

## 📱 Mobile App Integration

### Key Endpoints for Mobile
- `GET /api/v1/category` - Get all categories
- `GET /api/v1/product` - Get all products (paginated)
- `GET /api/v1/product/category/:id` - Products by category
- `POST /api/v1/cart/add` - Add to cart
- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/order` - Place order
- `GET /api/v1/favorite` - Get favorites
- `POST /api/v1/favorite` - Add to favorites

### Mobile Flow
1. **Authentication**: Register/Login → Get JWT token
2. **Browse**: Get categories → Get products → View details
3. **Shopping**: Add to cart → Manage quantities → Checkout
4. **Orders**: Place order → Track status → View history
5. **Favorites**: Add/remove items → Manage wishlist

## 🛡️ Admin Panel

### Admin Access
1. Create user with admin role
2. Use admin endpoints with proper permissions
3. Access admin dashboard at `/api/v1/admin/*`

### Admin Features
- User management with role assignment
- Product & category CRUD operations
- Order management & status updates
- Analytics dashboard
- System health monitoring

## 🔍 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check PostgreSQL is running
docker-compose ps
# or
pg_isready -h localhost -p 5432
```

**Port Already in Use**
```bash
# Change PORT in .env file
PORT=3003
```

**JWT Token Issues**
```bash
# Ensure JWT_SECRET is set in .env
JWT_SECRET=your-very-long-secret-key-here
```

### Logs
```bash
# Application logs
npm run start:dev

# Docker logs
docker-compose logs -f nest-app
docker-compose logs -f postgres
```

## 📞 Support

For issues and questions:
1. Check the Swagger documentation at `/api/docs`
2. Review this setup guide
3. Check application logs for error details
4. Ensure all environment variables are properly set

## 🚀 Production Deployment

### Environment Configuration
```env
NODE_ENV=production
DATABASE_HOST=your-production-db-host
JWT_SECRET=very-secure-production-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Security Checklist
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS properly
- [ ] Set synchronize: false in TypeORM
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Set up monitoring and health checks
