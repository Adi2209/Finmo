import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class FxRatesDto {

  @ApiProperty({description: 'quoteId to retrieve forex exchange rate from cache',example: '662d12e2de0c81ef3a9878c1'})
  @IsString()
  quoteId: string;

  @ApiResponseProperty()
  @ApiProperty({description: 'Expiry Date of the exchange rate in cache',example: 'DD/MM/YYYY, HH:MM:SS IST'})
  @IsNotEmpty()
  @IsString()
  expiry_at: string;

  @ApiResponseProperty()
  @ApiProperty({description: 'Fx rate',example: '83.78'})
  @IsNotEmpty()
  fxRate: string;
}
