import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsObject } from 'class-validator';
import { CurrencyAmountMap } from 'src/types';

/**
 * Data transfer object (DTO) for representing balance accounts.
 */
export class BalanceAccountsDto {
  /**
   * The ID of the user.
   */
  @ApiProperty({
    description: 'id of the user',
    example: '662d12e2de0c81ef3a9878c1',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  /**
   * The username of the user.
   */
  @ApiResponseProperty({ type: String, example: 'Harry' })
  username: string;

  /**
   * The email address of the user.
   */
  @ApiResponseProperty({ type: String, example: 'harry@example.com' })
  @IsEmail()
  email: string;

  /**
   * The balance of the user, represented as a map of currency codes to amounts.
   */
  @ApiResponseProperty({
    example: '{"USD":100}',
  })
  @IsObject()
  balance: CurrencyAmountMap;
}
