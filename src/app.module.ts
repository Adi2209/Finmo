import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FxRatesController } from './fx-rates/fx-rates.controller';
import { HttpController } from './http/http.controller';
import { FxRateService } from './fx-rates/fx-rate.service';
import { HttpService } from './http/http.service';
import { FxRateModule } from './fx-rates/fx-rate.module';
import { HttpModule } from './http/http.module';
import { CrypterService } from './crypter.service';
import { AccountsController } from './accounts/accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsService } from './accounts/accounts.service';
import { AccountsModule } from './accounts/accounts.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RATE_LIMITS, TTL_RATE_LIMITING_MS } from './config';
import { APP_GUARD } from '@nestjs/core';
import { IpTrackingMiddleware } from './ip/ip-tracking.middleware';

@Module({
  imports: [
    FxRateModule,
    AccountsModule,
    HttpModule,
    MongooseModule.forRoot(
      `mongodb+srv://adi:Testing1234@fx-accounts.7pn4nmj.mongodb.net/FX-Accounts?retryWrites=true&w=majority&appName=FX-Accounts`,
    ),
    ThrottlerModule.forRoot([
      {
        ttl: TTL_RATE_LIMITING_MS,
        limit: RATE_LIMITS,
      },
    ]),
  ],
  controllers: [
    AppController,
    FxRatesController,
    HttpController,
    AccountsController,
  ],
  providers: [
    AppService,
    FxRateService,
    HttpService,
    CrypterService,
    AccountsService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpTrackingMiddleware)
      .forRoutes('*');
  }
}