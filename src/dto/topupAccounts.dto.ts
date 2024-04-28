import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { CurrencyAmountMap } from 'src/types';

/**
 * Data transfer object (DTO) for representing top-up accounts.
 */
export class TopUpAccountsDto {
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
  email: string;

  /**
   * The amount to top up for the user, represented as a map of currency codes to amounts.
   */
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
