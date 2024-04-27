import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAccountsDto } from '../dto/createAccounts.dto';
import { TopUpAccountsDto } from 'src/dto/topupAccounts.dto';
import { BalanceAccountsDto } from 'src/dto/balanceAccounts.dto';

@Controller('accounts')
@ApiTags('Accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiResponse({
    status:201,
    description: 'Account Created Successfully',
    type: CreateAccountsDto
  })
  async addAccount(
    @Body() request: CreateAccountsDto
  ) {
    const newuserId = await this.accountsService.createAccount(
      request.username,
      request.email,
      request.password,
      request.balance,
    );
    return { id: newuserId };
  }

  @Put('topup')
  @ApiResponse({
    status: 200,
    description: 'Balance Updated Successfully',
    type: TopUpAccountsDto
  })
  async topUp(
    @Body() request: TopUpAccountsDto
  ) {
    const response = await this.accountsService.topUpAccount(request.id, request.balance);
    return response;
  }

  @Get('balance')
  @ApiResponse({
    status: 200,
    description: 'Balance fetched Successfully',
    type: BalanceAccountsDto
  })
  async getBalance(@Body() request: BalanceAccountsDto) {
    const response = await this.accountsService.getBalance(request.id);
    return response;
  }
}
