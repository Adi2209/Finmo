import { ForbiddenException, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IP_BAN_DURATION_MS, IP_BAN_LIMIT } from 'src/config';
import { BannedIp } from 'src/schemas/banned-ip.schema';
import { IpRequestCount } from 'src/schemas/ip-request.schema';

/**
 * Middleware for tracking and managing IP addresses.
 */
@Injectable()
export class IpTrackingMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger('IpTrackingMiddleware');

  private readonly banDuration = IP_BAN_DURATION_MS;
  
  private readonly requestThreshold = IP_BAN_LIMIT;

  constructor(
    @InjectModel(BannedIp.name) private readonly bannedIpModel: Model<BannedIp>,
    @InjectModel(IpRequestCount.name)
    private readonly ipRequestCountModel: Model<IpRequestCount>,
  ) {}

  /**
   * Middleware function for tracking IP addresses and applying IP banning logic.
   * @param req The request object.
   * @param res The response object.
   * @param next The next function to call in the middleware chain.
   */
  async use(req: any, res: any, next: () => void) {
    const ip = req.ip || req.connection.remoteAddress;

    try {
      await this.cleanupExpiredData(ip);

      if (await this.isIpBanned(ip)) {
        throw new ForbiddenException(
          'Your IP address has been banned for 1 minute',
        );
      }

      await this.trackIpRequest(ip);

      if (await this.shouldBanIp(ip)) {
        await this.banIp(ip);
        throw new ForbiddenException(
          'Your IP address has been banned for 1 minute',
        );
      }

      next();
    } catch (error) {
      this.logger.error(`Error processing IP request: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clean up expired IP data.
   * @param ip The IP address to clean up data for.
   */
  async cleanupExpiredData(ip: string) {
    const currentTime = new Date();
    const timeWindow = new Date(currentTime.getTime() - this.banDuration);

    await this.ipRequestCountModel.deleteMany({
      timestamp: { $lt: timeWindow },
    });
    await this.bannedIpModel.deleteMany({
      expirationTime: { $lt: currentTime },
    });
  }

  /**
   * Check if an IP address is banned.
   * @param ip The IP address to check.
   * @returns A boolean indicating whether the IP address is banned.
   */
  async isIpBanned(ip: string): Promise<boolean> {
    const bannedIp = await this.bannedIpModel.findOne({ ip });
    return bannedIp && bannedIp.expirationTime > new Date();
  }

  /**
   * Track a request from an IP address.
   * @param ip The IP address to track the request for.
   */
  async trackIpRequest(ip: string) {
    await this.ipRequestCountModel.create({ ip, timestamp: new Date() });
  }

  /**
   * Determine if an IP address should be banned based on request count.
   * @param ip The IP address to check.
   * @returns A boolean indicating whether the IP address should be banned.
   */
  async shouldBanIp(ip: string): Promise<boolean> {
    const timeWindow = new Date(new Date().getTime() - this.banDuration);
    const ipRequestCount = await this.ipRequestCountModel.countDocuments({
      ip,
      timestamp: { $gt: timeWindow },
    });
    return ipRequestCount > this.requestThreshold;
  }

  /**
   * Ban an IP address.
   * @param ip The IP address to ban.
   */
  async banIp(ip: string) {
    await this.bannedIpModel.create({
      ip,
      expirationTime: new Date(Date.now() + this.banDuration),
    });
    this.logger.warn(`IP: ${ip} has been banned for 1 minute`);
  }
}
