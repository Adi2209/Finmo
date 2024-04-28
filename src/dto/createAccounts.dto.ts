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

export class CreateAccountsDto {

  @ApiResponseProperty({ type: String })
  id: string;

  @ApiProperty({ description: 'Username of the user', example: 'Harry' })
  @IsNotEmpty() 
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'harry@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'Harry@1234' })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 5,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @ApiProperty({
    description: 'Balance Amount of the user for all currencies',
    example: '{"USD":100}',
  })
  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  balance: CurrencyAmountMap;
}




