import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    if (exception.code === 11000) {
      response.status(400).json({
        message: 'duplicate error entry',
        keyValue: { email: 'test@mail.com' },
      });
    } else {
      const errorMessage = 'MongoDB Error: ' + exception.message;
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(statusCode).json({
        message: errorMessage,
        statusCode: statusCode,
      });
    }
  }
}
