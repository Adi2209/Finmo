import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsSchema } from './accounts.model'
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Accounts', schema: AccountsSchema }]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [MongooseModule]
})
export class AccountsModule {}
