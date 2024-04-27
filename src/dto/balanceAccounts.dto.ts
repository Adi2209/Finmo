import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  IsObject,
} from 'class-validator';
import { CurrencyAmountMap } from 'src/types';

export class BalanceAccountsDto {

  @ApiProperty({description: 'id of the user',example: '662d12e2de0c81ef3a9878c1'})
  @IsString()
  id: string;

  @ApiResponseProperty()
  @ApiProperty({description: 'Username of the user',example: 'Harry'})
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiResponseProperty()
  @ApiProperty({description: 'Email of the user',example: 'harry@example.com'})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiResponseProperty()
  @ApiProperty({description: 'Balance Amount of the user for all currencies', example: '{"USD":100}'})
  @IsObject()
  @Transform(({ value }) => JSON.parse(value.replace(/;/g, '')))
  balance: CurrencyAmountMap;
}
