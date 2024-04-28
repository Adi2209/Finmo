import { Module } from '@nestjs/common';
import { FxRatesController } from './fx-rates.controller';
import { FxRateService } from './fx-rate.service';
import { CrypterService } from 'src/crypter.service';

/**
 * Module for managing foreign exchange rates.
 * This module provides controllers and services for fetching and converting FX rates.
 * It also injects the necessary dependencies such as the FxRateService and CrypterService.
 */
@Module({
  providers: [FxRateService, CrypterService],
  controllers: [FxRatesController],
})
export class FxRateModule {}
