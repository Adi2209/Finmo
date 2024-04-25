import { Controller, Get, Query } from '@nestjs/common';
import { FxRateService } from './fx-rate.service';

@Controller('fx-rates')
export class FxRatesController {
  constructor(private readonly fxRateService: FxRateService) {}

  @Get()
  async getFxRates(
    @Query('fromCurrency') fromCurrency: string,
    @Query('toCurrency') toCurrency: string,
  ): Promise<string> {
    try {
      return this.fxRateService.getFxRates(
        fromCurrency,
        toCurrency,
      );
    } catch (error) {
      console.error('Could not get fx rate due to error: ', error);
      throw error;
    }
  }
}
