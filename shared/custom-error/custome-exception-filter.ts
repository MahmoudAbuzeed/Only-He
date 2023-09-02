import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { CustomError } from "./custom-error";

@Catch(CustomError)
export class CustomErrorFilter implements ExceptionFilter {
  catch(exception: CustomError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(exception.statusCode).json({
      statusCode: exception.statusCode,
      message: exception.message,
    });
  }
}
