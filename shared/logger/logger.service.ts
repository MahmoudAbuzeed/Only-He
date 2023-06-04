import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';

@Injectable()
export class Logger implements LoggerService {
  private logger: any;

  constructor() {
    this.logger = createLogger({
      transports: [
        new transports.Console(),
      ],
      format: format.combine(
        format.timestamp(),
        format.printf(({ level, message, timestamp }) => `${timestamp} [${level.toUpperCase()}] - ${message}`)
      )
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error({ message, trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
