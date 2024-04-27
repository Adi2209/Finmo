import { Module } from '@nestjs/common';
import { FxRatesController } from './fx-rates.controller';
import { FxRateService } from './fx-rate.service';
import { CrypterService } from 'src/crypter.service';
import { HttpService } from 'src/http/http.service';

@Module({
  providers: [FxRateService, CrypterService, HttpService],
  controllers: [FxRatesController],
})
export class FxRateModule {}
