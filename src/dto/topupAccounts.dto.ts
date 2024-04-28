import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { CurrencyAmountMap } from 'src/types';

export class TopUpAccountsDto {
  @ApiProperty({
    description: 'id of the user',
    example: '662d12e2de0c81ef3a9878c1',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiResponseProperty({ type: String, example: 'Harry' })
  username: string;

  @ApiResponseProperty({ type: String, example: 'harry@example.com' })
  email: string;

  @ApiProperty({
    description: 'Enter the Amount to top up',
    example: '{"USD":100}',
  })
  @IsObject()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  balance: CurrencyAmountMap;
}
