import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "shared/logger/logger.service";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = app.get(Logger);

  // Deployment timestamp: 2025-09-29 - Fixed database connectivity for App Runner
  // RDS is now publicly accessible - should resolve connection timeouts
  console.log("🚀 Only-He API starting up...");

  // app.useLogger(logger);
  // Set global prefix
  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      whitelist: true,
      // forbidNonWhitelisted: process.env.NODE_ENV === 'development',
    })
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("Only-He E-Commerce API")
    .setDescription(
      "Comprehensive E-Commerce API for mobile applications with user management, product catalog, shopping cart, orders, and favorites"
    )
    .setVersion("1.0")
    .addTag("Authentication", "User registration and login endpoints")
    .addTag("Categories", "Product category management")
    .addTag("Products", "Product catalog and management")
    .addTag("Cart", "Shopping cart operations")
    .addTag("Orders", "Order management and checkout")
    .addTag("Favorites", "User wishlist and favorites")
    .addTag("Users", "User profile management")
    .addTag("Roles", "User role management")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .addServer("http://localhost:7002", "Development server")
    .addServer("https://z5cpphjngn.us-east-1.awsapprunner.com", "Production server")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
    customSiteTitle: "Only-He API Documentation",
    customfavIcon: "/favicon.ico",
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { color: #3b82f6 }
    `,
  });

  const port = process.env.PORT || 7002;
  await app.listen(port);
  console.log(`✅ Application is running on: http://localhost:${port}/api/v1`);
  console.log(
    `📚 API Documentation available at: http://localhost:${port}/api/docs`
  );
  console.log(`🎉 Only-He API successfully started on port ${port}!`);
}
bootstrap();
