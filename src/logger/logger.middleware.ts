import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for logging incoming API requests.
 * This middleware logs details of incoming HTTP requests such as method and URL
 * This middleware help in better debugging
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger('LoggerMiddleware');

  /**
   * Logs incoming API requests.
   * @param req The incoming request object.
   * @param res The outgoing response object.
   * @param next The next function to call in the middleware chain.
   */
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('API Request: ', req.method, req.url);
    next();
  }
}
