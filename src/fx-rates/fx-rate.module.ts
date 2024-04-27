import { Module } from '@nestjs/common';
import { FxRatesController } from './fx-rates.controller';
import { FxRateService } from './fx-rate.service';
import { CrypterService } from 'src/crypter.service';

@Module({
  providers: [FxRateService, CrypterService],
  controllers: [FxRatesController],
})
export class FxRateModule {}
