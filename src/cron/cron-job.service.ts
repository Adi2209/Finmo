import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import cron from 'node-cron';
import axios from 'axios';
import { DEPLOYMENT_URL } from '../config';

/**
 * Injectable service for managing a cron job to ping the deployment URL at regular intervals.
 */
@Injectable()
export class CronJob implements OnModuleInit {
  private readonly logger = new Logger('CronJob');

  async onModuleInit() {
    const cronSchedule = '*/4 * * * *'; // Every 4 minutes
    const urlToPing = DEPLOYMENT_URL;

    cron.schedule(
      cronSchedule,
      async () => {
        try {
          const response = await axios.get(urlToPing);
          this.logger.warn(
            `Ping successful at ${new Date().toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
            })}: ${response.status}`,
          );
        } catch (error) {
          this.logger.error(`Error pinging URL: ${error.message}`);
        }
      },
      {
        timezone: 'Asia/Kolkata',
      },
    );

    this.logger.log(
      'Cron job scheduled to ping the URL every 4 minutes in IST timezone.',
    );
  }
}
