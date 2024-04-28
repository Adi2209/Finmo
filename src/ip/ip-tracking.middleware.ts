import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { RATE_LIMITS, TTL_RATE_LIMITING_MS } from 'src/config';

/**
 * Middleware for tracking incoming requests based on IP addresses.
 * This middleware keeps track of the number of requests received from each IP address.
 * It also bans IPs temporarily if they exceed a certain threshold.
 */
@Injectable()
export class IpTrackingMiddleware implements NestMiddleware {
  private readonly ipRequestCount = new Map<string, number>();

  private readonly bannedIps = new Map<string, number>();

  private readonly logger: Logger = new Logger('IpTrackingMiddleware');

  private readonly banDuration = TTL_RATE_LIMITING_MS;
  
  private readonly requestThreshold = RATE_LIMITS;

  /**
   * Handles incoming requests and tracks the number of requests from each IP address.
   * If an IP exceeds the request threshold, it is temporarily banned.
   * @param req The incoming request object.
   * @param res The outgoing response object.
   * @param next The next function to call in the middleware chain.
   * @throws ForbiddenException Throws a ForbiddenException if the IP address is banned or if the request threshold is exceeded.
   */
  use(req: any, res: any, next: () => void) {
    const ip = req.ip || req.connection.remoteAddress;

    // Check if IP is banned
    if (this.bannedIps.has(ip)) {
      const banExpirationTime = this.bannedIps.get(ip);
      if (banExpirationTime > Date.now()) {
        this.logger.warn(`Ip: ${ip} has been banned for 1 minute`);
        throw new ForbiddenException(
          'Your IP address has been banned for 1 minute',
        );
      } else {
        this.bannedIps.delete(ip);
      }
    }

    // Track request count for IP
    const count = this.ipRequestCount.get(ip) || 0;
    this.ipRequestCount.set(ip, count + 1);

    // Check if request count exceeds threshold
    if (count + 1 > this.requestThreshold) {
      this.bannedIps.set(ip, Date.now() + this.banDuration);
      this.logger.warn(`Ip: ${ip} has been banned for 1 minute`);
      throw new ForbiddenException(
        'Your IP address has been banned for 1 minute',
      );
    }

    next();
  }
}
