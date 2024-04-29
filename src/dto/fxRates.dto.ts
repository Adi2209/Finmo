import { ApiProperty, ApiQuery, ApiResponseProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

/**
 * Data transfer object (DTO) for representing FX rates.
 */
export class FxRatesDto {

  /**
   * The quote ID to retrieve forex exchange rate from cache.
   */
  @ApiProperty({description: 'quoteId to retrieve forex exchange rate from cache',example: 'Oh/DOSsUGN+oZn6Jdj/wql353x7QhrFlyPqYo4WgVbucwmwCwEDtz6kZqBCJ6Reo'})
  @IsString()
  @IsNotEmpty()
  quoteId: string;

  /**
   * The expiry date of the exchange rate in cache.
   */
  @ApiResponseProperty()
  @ApiProperty({description: 'Expiry Date of the exchange rate in cache',example: 'DD/MM/YYYY, HH:MM:SS IST'})
  @IsString()
  expiry_at: string;

  /**
   * The forex exchange rate.
   */
  @ApiResponseProperty()
  @ApiProperty({description: 'Fx rate',example: '83.78'})
  fxRate: string;
}
