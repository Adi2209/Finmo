import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class FxRatesDto {

  @ApiProperty({description: 'quoteId to retrieve forex exchange rate from cache',example: 'Oh/DOSsUGN+oZn6Jdj/wql353x7QhrFlyPqYo4WgVbucwmwCwEDtz6kZqBCJ6Reo'})
  @IsString()
  @IsNotEmpty()
  quoteId: string;

  @ApiResponseProperty()
  @ApiProperty({description: 'Expiry Date of the exchange rate in cache',example: 'DD/MM/YYYY, HH:MM:SS IST'})
  @IsString()
  expiry_at: string;

  @ApiResponseProperty()
  @ApiProperty({description: 'Fx rate',example: '83.78'})
  fxRate: string;
}
