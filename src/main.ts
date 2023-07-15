import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "shared/logger/logger.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = app.get(Logger);

  app.useLogger(logger);
  // Set global prefix
  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      whitelist: true,
      // forbidNonWhitelisted: process.env.NODE_ENV === 'development',
    }),
  );

  await app.listen(3002);
}
bootstrap();
