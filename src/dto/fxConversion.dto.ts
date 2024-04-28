import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

/**
 * Data transfer object (DTO) for representing currency conversion request.
 */
export class FxConversionDto {

  /**
   * The quote ID to retrieve forex exchange rate from cache.
   */
  @ApiProperty({description: 'quoteId to retrieve forex exchange rate from cache',example: 'Oh/DOSsUGN+oZn6Jdj/wql353x7QhrFlyPqYo4WgVbucwmwCwEDtz6kZqBCJ6Reo'})
  @IsNotEmpty()
  @IsString()
  quoteId: string;

  /**
   * The currency code to convert from.
   */
  @ApiProperty({description: 'Currency to get FX rate from',example: 'USD'})
  @IsNotEmpty()
  fromCurrency: string;

  /**
   * The currency code to convert to.
   */
  @ApiProperty({description: 'Currency to get FX rate in',example: 'INR'})
  @IsNotEmpty()
  toCurrency: string;

  /**
   * The amount to convert.
   */
  @ApiProperty({description: 'Enter Amount to Convert',example: '100'})
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  /**
   * The fetched forex exchange rate.
   */
  @ApiResponseProperty()
  fxRate: string;
}
