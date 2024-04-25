import { Controller, Get, Query } from '@nestjs/common';
import { ConversionRateService } from './conversion-rate.service';

@Controller('conversion-rates')
export class ConversionRatesController {
  constructor(private readonly conversionRateService: ConversionRateService) {}

  @Get()
  async getConversionRates(
    @Query('fromCurrency') fromCurrency: string,
    @Query('toCurrency') toCurrency: string,
  ): Promise<string> {
    try {
      return this.conversionRateService.getConversionRates(
        fromCurrency,
        toCurrency,
      );
    } catch (error) {
      console.error('Could not get conversion rate due to error: ',error);
    }
  }
}
