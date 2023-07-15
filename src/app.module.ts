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
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mysql",
      // host: 'mysqldb',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: entities,
      synchronize: true,
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
