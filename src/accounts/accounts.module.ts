import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsSchema } from '../schemas/accounts.model';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from 'src/authentication/authentication.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Accounts', schema: AccountsSchema }]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService, JwtService, AuthenticationService],
  exports: [MongooseModule],
})
export class AccountsModule {}
