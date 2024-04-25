import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { FxRateService } from './fx-rate.service';

@Controller('fx-rates')
export class FxRatesController {
  constructor(private readonly fxRateService: FxRateService) {}

  @Get()
  async getFxRates(
    @Query('fromCurrency') fromCurrency: string,
    @Query('toCurrency') toCurrency: string,
    @Res() res: Response,
  ): Promise<void> {
    const response  = await this.fxRateService.getFxRates(
      fromCurrency,
      toCurrency,
    );
    response === null ? res.status(500).json(response) : res.json(response);
  }
}
