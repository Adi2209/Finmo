import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from '../../authentication/authentication.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AccountsController } from '../accounts.controller';
import { AccountsService } from '../accounts.service';
import { CreateAccountsDto } from '../../dto/createAccounts.dto';
import { JwtService } from '@nestjs/jwt';
import { BalanceAccountsDto } from 'src/dto/balanceAccounts.dto';
import { TopUpAccountsDto } from 'src/dto/topupAccounts.dto';

describe('AccountsController', () => {
  let controller: AccountsController;
  let accountsService: AccountsService;

  const mockAccountsModel = {};
  const mockJwtService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        AccountsService,
        AuthenticationService,
        {
          provide: 'AccountsModel',
          useValue: mockAccountsModel,
        },
        {
          provide: JwtService, 
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  describe('addAccount', () => {
    it('should create a new account', async () => {
      const createAccountsDto: CreateAccountsDto = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        balance: { USD: 1 },
      };

      const createAccountSpy = jest
        .spyOn(AccountsService.prototype, 'createAccount')
        .mockResolvedValueOnce('newUserId');

      const result = await controller.addAccount(createAccountsDto);
      expect(createAccountSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 'newUserId' });
    });

    it('should handle errors during account creation', async () => {
      const createAccountsDto: CreateAccountsDto = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        balance: { USD: 1 },
      };

      jest
        .spyOn(AccountsService.prototype, 'createAccount')
        .mockRejectedValueOnce(new BadRequestException());

      await expect(controller.addAccount(createAccountsDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('topUp', () => {
    it('should top up the balance of an account', async () => {
      const request: TopUpAccountsDto = {
        id: 'accountId',
        username: 'testuser',
        email: 'test@example.com',
        balance: { USD: 1 },
      };
      const updatedAccountDetails: any = {};
      jest
        .spyOn(AccountsService.prototype, 'topUpAccount')
        .mockResolvedValueOnce(updatedAccountDetails);

      const result = await controller.topUp(request);

      expect(result).toBe(updatedAccountDetails);
    });

    it('should handle error when topping up balance', async () => {
      const request: TopUpAccountsDto = {
        id: 'accountId',
        username: 'testuser',
        email: 'test@example.com',
        balance: { USD: 1 },
      };
      jest
        .spyOn(AccountsService.prototype, 'topUpAccount')
        .mockRejectedValueOnce(new BadRequestException('Failed to top up balance'));

      await expect(controller.topUp(request)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getBalance', () => {
    it('should fetch the balance of an account', async () => {
      const accountId = 'accountId';
      const balanceDetails = {} as BalanceAccountsDto; // Mocked balance details from the service
      jest
        .spyOn(accountsService, 'getBalance')
        .mockResolvedValueOnce(balanceDetails);

      const result = await controller.getBalance(accountId);

      expect(result).toBe(balanceDetails);
    });

    it('should handle error when fetching balance', async () => {
      const accountId = 'accountId';
      jest
        .spyOn(AccountsService.prototype, 'getBalance')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(controller.getBalance(accountId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
