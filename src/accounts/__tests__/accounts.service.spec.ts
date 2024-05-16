import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { AccountsService } from './../accounts.service';
import { Accounts } from '../../schemas/accounts.model';
import { getModelToken } from '@nestjs/mongoose';

describe('AccountsService', () => {
  let service: AccountsService;
  let accountsModel: Model<Accounts>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: getModelToken('Accounts'), // Replace 'getModelToken' with the actual function used to inject the model
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    accountsModel = module.get<Model<Accounts>>(getModelToken('Accounts'));
  });

  describe('createAccount', () => {
    it('should create a new account', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        balance: { USD: 100 },
      };
      const mockNewAccount = {
        _id: 'id',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        balance: { USD: 100 },
        save: jest.fn().mockResolvedValueOnce('done'),
      };
      jest.spyOn(accountsModel, 'findOne').mockResolvedValueOnce(null);
      jest
        .spyOn(accountsModel, 'create')
        .mockResolvedValueOnce(mockNewAccount as any);

      const result = await service.createAccount(
        userData.username,
        userData.email,
        userData.password,
        userData.balance,
      );
      expect(result).toBe('id');
    });

    it('should throw BadRequestException if email already exists', async () => {
      const userData = {
        username: 'testuser',
        email: 'existing@example.com', // Assuming email already exists
        password: 'testpassword',
        balance: { USD: 100 },
      };
      jest
        .spyOn(accountsModel, 'findOne')
        .mockResolvedValueOnce({ email: userData.email });

      await expect(
        service.createAccount(
          userData.username,
          userData.email,
          userData.password,
          userData.balance,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('topUpAccount', () => {
    it('should top up the balance of an account', async () => {
      const balance = { JPY: 200 };
      const mockAccount = {
        _id: 'id',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        balance: { USD: 100 },
      };

      const account = {
        ...mockAccount,
        save: jest.fn().mockResolvedValueOnce(mockAccount),
        markModified: jest.fn().mockResolvedValueOnce(balance),
      };
      jest.spyOn(accountsModel, 'findById').mockResolvedValueOnce(account);

      const result = await service.topUpAccount(account._id, balance);
      expect(result.id).toBe(account._id);
      expect(result.balance).toEqual({ USD: 100, JPY: 200 });
      expect(account.save).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if account does not exist', async () => {
      const userId = 'nonExistingUserId';
      const balance = { USD: 100 };
      jest.spyOn(accountsModel, 'findById').mockResolvedValueOnce(null);

      await expect(service.topUpAccount(userId, balance)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getBalance', () => {
    it('should retrieve the balance of an account', async () => {
      const userId = 'existingUserId';
      const account = {
        _id: userId,
        username: 'testuser',
        email: 'test@example.com',
        balance: { USD: 100 },
      };
      jest.spyOn(accountsModel, 'findById').mockResolvedValueOnce(account);

      const result = await service.getBalance(userId);

      expect(result.id).toBe(userId);
      expect(result.username).toBe('testuser');
      expect(result.email).toBe('test@example.com');
      expect(result.balance).toEqual({ USD: 100 });
    });

    it('should throw NotFoundException if account does not exist', async () => {
      const userId = 'nonExistingUserId';
      jest.spyOn(accountsModel, 'findById').mockResolvedValueOnce(null);

      await expect(service.getBalance(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
