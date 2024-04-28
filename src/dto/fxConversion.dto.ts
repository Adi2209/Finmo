import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class FxConversionDto {

  @ApiProperty({description: 'quoteId to retrieve forex exchange rate from cache',example: 'Oh/DOSsUGN+oZn6Jdj/wql353x7QhrFlyPqYo4WgVbucwmwCwEDtz6kZqBCJ6Reo'})
  @IsNotEmpty()
  @IsString()
  quoteId: string;

  @ApiProperty({description: 'Currency to get FX rate from',example: 'USD'})
  @IsNotEmpty()
  fromCurrency: string;

  @ApiProperty({description: 'Currency to get FX rate in',example: 'INR'})
  @IsNotEmpty()
  toCurrency: string;

  @ApiProperty({description: 'Enter Amount to Convert',example: '100'})
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiResponseProperty()
  fxRate: string;
}
