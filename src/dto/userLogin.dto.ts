import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object (DTO) for user login.
 */
export class UserLoginDto {
  
  /**
   * The username of the user.
   */
  @ApiProperty({ example: 'Harry123' , description: 'Username of the user'})
  @IsNotEmpty()
  @IsString()
  username: string;

  /**
   * The password of the user.
   */
  @ApiProperty({ example: 'Harry@123' , description: 'Password of the user'}) 
  @IsNotEmpty()
  @IsString()
  password: string;
}
