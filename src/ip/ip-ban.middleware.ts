import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { IpTrackingMiddleware } from './ip-tracking.middleware';
import { RATE_LIMITS, TTL_RATE_LIMITING_MS } from 'src/config';

@Injectable()
export class IpBanMiddleware implements NestMiddleware {

  private readonly bannedIps = new Map<string, number>(); 

  private readonly banDuration = TTL_RATE_LIMITING_MS; 

  constructor(private readonly ipTrackingMiddleware: IpTrackingMiddleware) {}

  use(req: any, res: any, next: () => void) {
    const ip = req.ip || req.connection.remoteAddress; 
    if (this.bannedIps.has(ip)) {
      const banExpirationTime = this.bannedIps.get(ip);
      if (banExpirationTime > Date.now()) {
        throw new ForbiddenException('Your IP address has been banned for 1 minute');
      } else {
        this.bannedIps.delete(ip);
      }
    }

    const requestCount = this.ipTrackingMiddleware.getIpRequestCount(ip);
    const requestThreshold = RATE_LIMITS;
    if (requestCount > requestThreshold) {
      this.bannedIps.set(ip, Date.now() + this.banDuration);
      throw new ForbiddenException('Your IP address has been banned for 1 minute');
    }

    next();
  }
}
