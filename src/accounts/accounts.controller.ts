import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAccountsDto } from '../dto/createAccounts.dto';
import { TopUpAccountsDto } from 'src/dto/topupAccounts.dto';
import { BalanceAccountsDto } from 'src/dto/balanceAccounts.dto';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('accounts')
@ApiTags('Accounts')
export class AccountsController {
  private readonly logger: Logger = new Logger('AccountsController');

  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({
    status: 201,
    description: 'Account Created Successfully',
    type: String,
  })
  @ApiConflictResponse({ description: 'Account Already Exists' })
  @ApiBadRequestResponse({
    description: 'Invalid data or data Validation Failed',
  })
  async addAccount(@Body() request: CreateAccountsDto) {
    try {
      const newUserId = await this.accountsService.createAccount(
        request.username,
        request.email,
        request.password,
        request.balance,
      );
      return { id: newUserId };
    } catch (error) {
      this.logger.warn(`Failed to create an account due to error: ${error}`);
      throw error;
    }
  }

  @Put('topup')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({
    status: 200,
    description: 'Balance Updated Successfully',
    type: TopUpAccountsDto,
  })
  @ApiBadRequestResponse({
    description: 'Failed to update the account balance',
  })
  @ApiNotFoundResponse({
    description:
      'Failed to update the account balance, as the account cannot with the given id does not exist',
  })
  async topUp(@Body() request: TopUpAccountsDto) {
    try {
      const response = await this.accountsService.topUpAccount(
        request.id,
        request.balance,
      );
      return response;
    } catch (error) {
      this.logger.warn(`Failed to update balance due to error: ${error}`);
      throw error;
    }
  }

  @Get('balance/:id')
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({
    status: 200,
    description: 'Balance fetched Successfully',
    type: BalanceAccountsDto,
  })
  @ApiBadRequestResponse({ description: 'Failed to fetch the balance' })
  @ApiNotFoundResponse({
    description:
      'Failed to fetch the account balance, as the account cannot with the given id does not exist',
  })
  async getBalance(@Param('id') id: string) {
    try {
      const response = await this.accountsService.getBalance(id);
      return response;
    } catch (error) {
      this.logger.warn(`Failed to fetch the balance due to error: ${error}`);
      throw error;
    }
  }
}
