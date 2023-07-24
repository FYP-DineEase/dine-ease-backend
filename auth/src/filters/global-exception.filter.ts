import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { AppLoggerService, Stages } from '@mujtaba-web/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly appLogger: AppLoggerService) {}

  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const devErrorRes: any = {
      path: request.url,
      statusCode,
      method: request.method,
      errorName: exception?.name,
      message: exception?.message,
    };

    const prodErrorRes: any = {
      statusCode,
      message,
    };

    this.appLogger.error('Error Handler: ', exception);

    response
      .status(statusCode)
      .json(process.env.STAGE === Stages.DEV ? devErrorRes : prodErrorRes);
  }
}
