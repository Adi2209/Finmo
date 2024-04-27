import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    FxRateModule,
    AccountsModule,
    HttpModule,
    MongooseModule.forRoot(`mongodb+srv://adi:Testing1234@fx-accounts.7pn4nmj.mongodb.net/FX-Accounts?retryWrites=true&w=majority&appName=FX-Accounts`),
  ],
  controllers: [
    AppController,
    FxRatesController,
    HttpController,
    AccountsController,
  ],
  providers: [AppService, FxRateService, HttpService, CrypterService, AccountsService],
})
export class AppModule {}
