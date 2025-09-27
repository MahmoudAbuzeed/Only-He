import { Module, Global, MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { modules } from "./modules";
import { entities } from "./entities";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { JwtService } from "@nestjs/jwt";
import { Logger } from "shared/logger/logger.service";
import { LoggerMiddleware } from "shared/logger/logger.middleware";

@Global()
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploadedFiles"),
      serveRoot: "/uploads",
      exclude: ["/api*"],
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST || "localhost",
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || "postgres",
      password: process.env.DATABASE_PASSWORD || "postgres",
      database: process.env.DATABASE_NAME || "only_he_db",
      entities: entities,
      synchronize: true, // Set to false in production
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    }),
    ...modules,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, Logger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
