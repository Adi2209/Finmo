import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FxRatesController } from './fx-rates/fx-rates.controller';
import { HttpController } from './http/http.controller';
import { FxRateService } from './fx-rates/fx-rate.service';
import { HttpService } from './http/http.service';
import { FxRateModule } from './fx-rates/fx-rate.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [FxRateModule, HttpModule],
  controllers: [AppController, FxRatesController, HttpController],
  providers: [AppService, FxRateService, HttpService],
})
export class AppModule {}
