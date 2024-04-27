import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { FxRateService } from './fx-rate.service';
import { ConversionRateRequestType } from 'src/types';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FxRatesDto } from 'src/dto/fxRates.dto';
import { FxConversionDto } from 'src/dto/fxConversion.dto';

@ApiTags('FX-Rates')
@Controller()
export class FxRatesController {
  constructor(private readonly fxRateService: FxRateService) {}

  @Get('fx-rates')
  @ApiResponse({
    status: 200,
    description: 'FX rates fetched Successfully',
    type: FxRatesDto
  })
  async getFxRates(
    @Query('fromCurrency') fromCurrency: string,
    @Query('toCurrency') toCurrency: string,
    @Res() res: Response,
  ): Promise<void> {
    const response = await this.fxRateService.getFxRates(
      fromCurrency,
      toCurrency,
    );
    response === null ? res.status(500).json(response) : res.json(response);
  }

  @Post('fx-conversion')
  @ApiResponse({
    status:200,
    description: 'Amount to final currency fetched successfully',
    type: FxConversionDto
  })
  async convertFxRate(
    @Body() request: FxConversionDto,
  ){
    console.log('covnersion controller');
    const response = await this.fxRateService.convertFXRate(
      request.fromCurrency,
      request.toCurrency,
      request.amount,
      request.quoteId
    );
    return response;
  }
}
