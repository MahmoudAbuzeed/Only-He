import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ErrorHandler {
  notFound(error: any = { message: 'Not Found' }) {
    throw new NotFoundException(error);
  }

  badRequest(error: any) {
    throw new BadRequestException(error);
  }

  duplicateValue(error: any) {
    throw new BadRequestException({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Some fields are invalid',
    });
  }

  didNotMatch() {
    throw new BadRequestException({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Password did not match',
    });
  }

  invalidCredentials() {
    throw new HttpException(
      'Wrong credentials provided',
      HttpStatus.BAD_REQUEST,
    );
  }
}
