import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrencyAmountMap, AccountResponseType } from 'src/types';
import { Accounts } from './accounts.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AccountsService {
  private readonly logger: Logger = new Logger('AccountsService');

  constructor(
    @InjectModel('Accounts') private readonly accountsModel: Model<Accounts>,
  ) {}

  async createAccount(
    username: string,
    email: string,
    password: string,
    balance: CurrencyAmountMap,
  ): Promise<string> {
    const user = await this.accountsModel.findOne({ email: email });
    if (user) {
      this.logger.warn('A user with this email already exists, throwing error');
      throw new BadRequestException(
        'Sorry a user with this email already exists',
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = await this.accountsModel.create({
      username,
      email,
      password: hashedPassword,
      balance,
    });
    await newAccount.save();
    return newAccount._id.toString();
  }

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

    const response = await account.save();
    return {
      id: response._id,
      username: response.username,
      email: response.email,
      balance: response.balance,
    };
  }

  async getBalance(userId: string): Promise<AccountResponseType> {
    const account = await this.accountsModel.findById({ _id: userId });
    if (!account) {
      this.logger.warn(`Account with id: ${userId}, does not exist`);
      throw new NotFoundException(`Account with id: ${userId}, does not exist`);
    }
    return {
      id: account._id,
      username: account.username,
      email: account.email,
      balance: account.balance,
    };
  }
}
