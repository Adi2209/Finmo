import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, IsObject } from 'class-validator';
import { CurrencyAmountMap } from 'src/types';

export class BalanceAccountsDto {
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
  @IsEmail()
  email: string;

  @ApiResponseProperty({
    example: '{"USD":100}',
  })
  @IsObject()
  balance: CurrencyAmountMap;
}
