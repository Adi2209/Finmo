import { AuthenticationService } from '../authentication.service';
import { Model } from 'mongoose';
import { Accounts } from 'src/schemas/accounts.model';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserLoginDto } from 'src/dto/userLogin.dto';

bcrypt.compareSync = jest.fn((password, hashedPassword) => {
  return password === hashedPassword;
});

describe('AuthenticationService', () => {
  let authService: AuthenticationService;
  let accountsModel: Model<Accounts>;
  let jwtService: JwtService;

  beforeEach(() => {
    accountsModel = {} as Model<Accounts>;
    jwtService = new JwtService({
      secret: 'testSecret',
    });
    authService = new AuthenticationService(accountsModel, jwtService);
  });

  describe('validateUser', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      accountsModel.findOne = jest.fn().mockResolvedValueOnce(null);

      await expect(
        authService.validateUser('nonexistent', 'password'),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        username: 'existing',
        password: 'hashedPassword',
      } as Accounts;
      accountsModel.findOne = jest.fn().mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockImplementationOnce(() => false);

      await expect(
        authService.validateUser('existing', 'invalidPassword'),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should return user if credentials are valid', async () => {
      const mockUser = {
        username: 'existing',
        password: 'hashedPassword',
      } as Accounts;
      accountsModel.findOne = jest.fn().mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockImplementationOnce(() => true);

      const result = await authService.validateUser(
        'existing',
        'hashedPassword',
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('validateToken', () => {
    it('should return decoded payload if token is valid', async () => {
      const decodedPayload = { username: 'testuser', userId: '123' };
      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedPayload);

      const result = await authService.validateToken('validToken');

      expect(result).toEqual(decodedPayload);
    });

    it('should return null if token is invalid', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await authService.validateToken('invalidToken');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token if login is successful', async () => {
      const userData = {
        username: 'testuser',
        password: 'password',
      } as UserLoginDto;
      const user = { username: 'testuser', _id: '123' };
      jest
        .spyOn(authService, 'validateUser')
        .mockResolvedValue(user as Accounts);
      jest
        .spyOn(JwtService.prototype, 'sign')
        .mockReturnValueOnce('accessToken');

      const mockExpectedResult = {
        accessToken: 'accessToken',
        email: undefined,
        id: '123',
        username: 'testuser',
      };

      const result = await authService.login(userData);
      expect(result).toEqual(mockExpectedResult);
    });

    it('should return message if login fails', async () => {
      const userData = {
        username: 'testuser',
        password: 'invalidPassword',
      } as UserLoginDto;
      jest
        .spyOn(AuthenticationService.prototype, 'validateUser')
        .mockReturnValueOnce(null);

      await expect( authService.login(userData)).rejects.toThrow(BadRequestException);
    });
  });
});
