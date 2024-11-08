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

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const logger = new Logger(`${this.constructor.name}:${this.catch.name}`);
    logger.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Default
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    const error = exception.name;

    switch (exception.code) {
      case 'P2002': {
        statusCode = HttpStatus.BAD_REQUEST;
        message = `Duplicate field value: ${exception.meta.target}`;
        break;
      }
      case 'P2003': {
        statusCode = HttpStatus.BAD_REQUEST;
        message = `Invalid input data: ${exception.meta.target}`;
        break;
      }
      case 'P2014': {
        statusCode = HttpStatus.BAD_REQUEST;
        message = `Invalid field value: ${exception.meta.target}`;
        break;
      }
      default: {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal Server Error';
        break;
      }
    }

    httpAdapter.reply(response, { statusCode, message, error }, statusCode);
  }
}
