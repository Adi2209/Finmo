import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { RATE_LIMITS, TTL_RATE_LIMITING_MS } from 'src/config';

@Injectable()
export class IpTrackingMiddleware implements NestMiddleware {
  private ipRequestCount = new Map<string, number>();
  
  private bannedIps = new Map<string, number>(); 

  private banDuration = TTL_RATE_LIMITING_MS; 
  
  private requestThreshold = RATE_LIMITS;

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

    const count = this.ipRequestCount.get(ip) || 0;
    this.ipRequestCount.set(ip, count + 1);

    if (count + 1 > this.requestThreshold) {
      this.bannedIps.set(ip, Date.now() + this.banDuration);
      throw new ForbiddenException('Your IP address has been banned for 1 minute');
    }

    next();
  }

  getIpRequestCount(ip: string): number {
    return this.ipRequestCount.get(ip) || 0;
  }
}
