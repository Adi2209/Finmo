import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  
  @ApiProperty({ example: 'Harry123' , description: 'Username of the user'})
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'Harry@123' , description: 'Password of the user'}) 
  @IsNotEmpty()
  @IsString()
  password: string;
}
