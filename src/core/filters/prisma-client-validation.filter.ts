import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientValidationError)
export class PrismaClientValidationFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const logger = new Logger(`${this.constructor.name}:${this.catch.name}`);
    logger.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Default
    const statusCode = HttpStatus.BAD_REQUEST;
    const message = exception.message;
    const error = exception.name;

    httpAdapter.reply(response, { statusCode, message, error }, statusCode);
  }
}
