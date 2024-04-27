import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CurrencyAmountMap } from 'src/types';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async addAccount(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('balance') balance: CurrencyAmountMap,
  ) {
    const newuserId = await this.accountsService.createAccount(
      username,
      email,
      password,
      balance,
    );
    return { id: newuserId };
  }

  @Put('topup')
  async topUp(
    @Body('id') userId: string,
    @Body('balance') balance: CurrencyAmountMap,
  ) {
    const response = await this.accountsService.topUpAccount(userId, balance);
    return response;
  }

  @Get('balance')
  async getBalance(@Body('id') userId: string) {
    const response = await this.accountsService.getBalance(userId);
    return response;
  }
}
