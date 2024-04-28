import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger('LoggerMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('API Request: ', req.method, req.url, req.body);
    next();
  }
}
