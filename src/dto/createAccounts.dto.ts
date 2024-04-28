import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  IsObject,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { CurrencyAmountMap } from 'src/types';

/**
 * Data transfer object (DTO) for creating user accounts.
 */
export class CreateAccountsDto {

  @ApiResponseProperty({ type: String })
  id: string;

  /**
   * The username of the user.
   */
  @ApiProperty({ description: 'Username of the user', example: 'Harry' })
  @IsNotEmpty() 
  @IsString()
  username: string;

  /**
   * The email address of the user.
   */
  @ApiProperty({
    description: 'Email of the user',
    example: 'harry@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * The password of the user.
   */
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

  /**
   * The balance amount of the user for all currencies.
   */
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
  @IsPositiveBalance({ message: 'Balance amount should be positive' })
  balance: CurrencyAmountMap;
}

/**
 * Custom validation decorator to ensure that the balance amount is positive.
 */
function IsPositiveBalance(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPositiveBalance',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value === 'object') {
            const isPositive = Object.values(value).every((val: number) => val > 0);
            return isPositive;
          }
          return false;
        },
      },
    });
  };
}
