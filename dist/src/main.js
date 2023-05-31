"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const logger_service_1 = require("../shared/logger/logger.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const logger = app.get(logger_service_1.Logger);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        skipMissingProperties: false,
        whitelist: true,
    }));
    await app.listen(3002);
}
bootstrap();
//# sourceMappingURL=main.js.map