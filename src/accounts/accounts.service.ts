import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrencyAmountMap, AccountResponseType } from 'src/types';
import { Accounts } from '../schemas/accounts.model';
import bcrypt from 'bcryptjs';

/**
 * Service responsible for handling account-related operations.
 */
@Injectable()
export class AccountsService {
  private readonly logger: Logger = new Logger('AccountsService');

  /**
   * Constructor for AccountsService.
   * @param accountsModel The Mongoose model for the 'Accounts' collection.
   */
  constructor(
    @InjectModel('Accounts') private readonly accountsModel: Model<Accounts>,
  ) {}

  /**
   * Creates a new account.
   * @param username The username of the account.
   * @param email The email of the account.
   * @param password The password of the account.
   * @param balance The initial balance of the account.
   * @returns The ID of the newly created account.
   */
  async createAccount(
    username: string,
    email: string,
    password: string,
    balance: CurrencyAmountMap,
  ): Promise<string> {
    await this.validateCreateBody(username, email);
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const newAccount = await this.accountsModel.create({
      username,
      email,
      password: hashedPassword,
      balance,
    });
    await newAccount.save();
    return newAccount._id.toString();
  }

  /**
   * Tops up the balance of an existing account.
   * @param userId The ID of the account to top up.
   * @param balance The amount to add to the balance.
   * @returns Details of the updated account.
   */
  async topUpAccount(
    userId: string,
    balance: CurrencyAmountMap,
  ): Promise<AccountResponseType> {
    const account = await this.accountsModel.findById({ _id: userId });
    if (!account) {
      this.logger.warn(`Account with id: ${userId}, does not exist`);
      throw new NotFoundException(`Account with id: ${userId}, does not exist`);
    }

    for (const currency in balance) {
      account.balance[currency] =
        (account.balance[currency] || 0) + balance[currency];
    }
    account.markModified('balance');
    const response = await account.save();
    return {
      id: response._id,
      username: response.username,
      email: response.email,
      balance: response.balance,
    };
  }

  /**
   * Retrieves the balance of an account.
   * @param id The ID of the account.
   * @returns Details of the account including its balance.
   */
  async getBalance(id: string): Promise<AccountResponseType> {
    const account = await this.accountsModel.findById({ _id: id });
    if (!account) {
      this.logger.warn(`Account with id: ${id}, does not exist`);
      throw new NotFoundException(`Account with id: ${id}, does not exist`);
    }
    return {
      id: account._id,
      username: account.username,
      email: account.email,
      balance: account.balance,
    };
  }

  private async validateCreateBody(
    username: string,
    email: string,
  ): Promise<void> {
    const user = await this.accountsModel.findOne({
      $or: [{ email }, { username }],
    });
    if (user) {
      if (user.email === email) {
        throw new BadRequestException(
          'Sorry, a user with this email already exists',
        );
      } else if (user.username === username) {
        throw new BadRequestException(
          'Sorry, a user with this username already exists',
        );
      }
    }
  }
}
