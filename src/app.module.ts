import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FxRatesController } from './fx-rates/fx-rates.controller';
import { FxRateService } from './fx-rates/fx-rate.service';
import { FxRateModule } from './fx-rates/fx-rate.module';
import { CrypterService } from './crypter.service';
import { AccountsController } from './accounts/accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsService } from './accounts/accounts.service';
import { AccountsModule } from './accounts/accounts.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { IpTrackingMiddleware } from './ip/ip-tracking.middleware';
import { LoggerMiddleware } from './logger/logger.middleware';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './authentication/authentication.service';
import { RATE_LIMITS, TTL_RATE_LIMITING_MS } from './config';
import dotenv from 'dotenv'
import { CronJob } from './cron/CronJob';

dotenv.config();
@Module({
  imports: [
    FxRateModule,
    AccountsModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URI,
    ),
    ThrottlerModule.forRoot([
      {
        ttl: TTL_RATE_LIMITING_MS,
        limit: RATE_LIMITS,
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [
    AppController,
    FxRatesController,
    AccountsController,
  ],
  providers: [
    AppService,
    FxRateService,
    CrypterService,
    AccountsService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    AuthenticationService,
    CronJob
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpTrackingMiddleware, LoggerMiddleware).forRoutes('*');
  }
}
