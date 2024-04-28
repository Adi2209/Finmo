import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FxRateService } from './fx-rate.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FxRatesDto } from 'src/dto/fxRates.dto';
import { FxConversionDto } from 'src/dto/fxConversion.dto';

@ApiTags('FX-Rates')
@Controller()
export class FxRatesController {
  private readonly logger: Logger = new Logger('FxRatesController');

  constructor(private readonly fxRateService: FxRateService) {}

  @Get('fx-rates')
  @UsePipes(new ValidationPipe())
  @ApiResponse({
    status: 200,
    description: 'FX rates fetched Successfully',
    type: FxRatesDto,
  })
  @ApiBadRequestResponse()
  async getFxRates(
    @Query('fromCurrency') fromCurrency: string,
    @Query('toCurrency') toCurrency: string,
  ) {
    try {
      const response = await this.fxRateService.getFxRates(
        fromCurrency,
        toCurrency,
      );
      return response;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch fx exchange rates due to error: ${error}`,
      );
      throw error;
    }
  }

  @Post('fx-conversion')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({
    status: 200,
    description: 'Amount to final currency fetched successfully',
    type: FxConversionDto,
  })
  @ApiBadRequestResponse({
    description:
      'Failed to calculate the converted amount, as the quoteId is expired/invalid',
  })
  @ApiNotFoundResponse({
    description:
      'Failed to calculate the converted amount, as the quoteId is expired/invalid',
  })
  async convertFxRate(@Body() request: FxConversionDto) {
    try {
      const response = await this.fxRateService.convertFXRate(
        request.fromCurrency,
        request.toCurrency,
        request.amount,
        request.quoteId,
      );
      return response;
    } catch (error) {
      this.logger.warn(
        `Failed to convert the amount from ${request.fromCurrency} to ${request.toCurrency} due to error: ${error}`,
      );
      throw error;
    }
  }
}
