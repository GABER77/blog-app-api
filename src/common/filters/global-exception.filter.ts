import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

// Catch all unhandled exceptions in the app
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  // Setup a logger so you can print errors to the console
  private readonly logger = new Logger('GlobalExceptionFilter');

  // This method will run whenever an exception is thrown in the app
  catch(exception: unknown, context: ArgumentsHost) {
    // Get the HTTP request and response objects from the context
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    // Let NestJS handle known HTTP exceptions like BadRequestException, NotFoundException, etc.
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resBody = exception.getResponse();

      response.status(status).json(resBody);
      return;
    }

    // Default response if we don't handle the specific error
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR; // 500
    let message = 'Internal server error';

    // Handle TypeORM database errors
    if (exception instanceof QueryFailedError) {
      message = 'Database operation failed. Please try again later.';
      statusCode = HttpStatus.SERVICE_UNAVAILABLE; // 503
    }

    // log all other uncaught errors too
    this.logger.error(
      `Unhandled error on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
