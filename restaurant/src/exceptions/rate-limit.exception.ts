import { HttpException, HttpStatus } from '@nestjs/common';

export class RateLimitExceededException extends HttpException {
  constructor(message: string) {
    super(message || 'Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
  }
}
