import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateAccountsDto } from '../dto/createAccounts.dto';
import { TopUpAccountsDto } from '../dto/topupAccounts.dto';
import { BalanceAccountsDto } from '../dto/balanceAccounts.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthenticationService } from '../authentication/authentication.service';
import { UserLoginDto } from '../dto/userLogin.dto';
import { AuthenticationGuard } from '../authentication/authentication.guard';

/**
 * Controller for handling account-related endpoints.
 */
@SkipThrottle()
@Controller('accounts')
@ApiTags('Accounts')
export class AccountsController {
  private readonly logger: Logger = new Logger('AccountsController');

  constructor(
    private readonly accountsService: AccountsService,
    private readonly authService: AuthenticationService,
  ) {}

  /**
   * Endpoint for creating a new account.
   * @param request The request body containing account details.
   * @returns The ID of the newly created account.
   */
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

  /**
   * Endpoint for topping up the balance of an account.
   * @param request The request body containing the account ID and balance to top up.
   * @returns The updated account details.
   */
  @Put('topup')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized User' })
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

  /**
   * Endpoint for fetching the balance of an account.
   * @param id The ID of the account.
   * @returns The account balance.
   */
  @Get('balance/:id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized User' })
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

  /**
   * Endpoint for user login.
   * @param loginDto The request body containing user login credentials.
   * @returns The JWT token upon successful login.
   */
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() loginDto: UserLoginDto) {
    try {
      const token = await this.authService.login(loginDto);
      return { token };
    } catch (error) {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
