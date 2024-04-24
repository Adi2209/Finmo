import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversionRatesController } from './conversion-rates/conversion-rates.controller';
import { HttpController } from './http/http.controller';
import { ConversionRateService } from './conversion-rates/conversion-rate.service';
import { HttpService } from './http/http.service';
import { ConversionRateModule } from './conversion-rates/conersion-rate.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [ConversionRateModule, HttpModule],
  controllers: [AppController, ConversionRatesController, HttpController],
  providers: [AppService, ConversionRateService, HttpService],
})
export class AppModule {}
