import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { FxRateService } from './fx-rate.service';
import { ConversionRateRequestType } from 'src/types';

@Controller()
export class FxRatesController {
  constructor(private readonly fxRateService: FxRateService) {}

  @Get('fx-rates')
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

  @Post('fx-conversion')
  async convertFxRate(
    @Body() requestBody: ConversionRateRequestType,
    @Res() res: Response,
  ): Promise<void> {
    console.log('covnersion controler');
    const response  = await this.fxRateService.convertFXRate(requestBody.fromCurrency,requestBody.toCurrency,requestBody.amount);
    response === null ? res.status(500).json(response) : res.json(response);
  }
}
