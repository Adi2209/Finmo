import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from 'src/dto/userLogin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Accounts } from 'src/accounts/accounts.model';

/**
 * Service for authentication-related operations, such as user validation and token management.
 */
@Injectable()
export class AuthenticationService {
  private readonly logger: Logger = new Logger('AuthenticationService');

  constructor(
    @InjectModel('Accounts') private readonly accountsModel: Model<Accounts>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials.
   * @param username The username of the user.
   * @param password The password of the user.
   * @returns The user account if valid.
   * @throws {NotFoundException} If the user does not exist.
   * @throws {UnauthorizedException} If the credentials are invalid.
   */
  async validateUser(username: string, password: string): Promise<Accounts> {
    const user = await this.accountsModel.findOne({ username });
    if (!user) {
      throw new NotFoundException(
        `User with username: ${username} does not exist`,
      );
    }
    const isPasswordValid = await bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  /**
   * Validates the authenticity of a token.
   * @param token The JWT token to validate.
   * @returns The decoded token payload if valid, or null if invalid.
   */
  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      this.logger.warn(error);
      return null;
    }
  }

  /**
   * Logs in a user and generates an access token.
   * @param userData The user login data.
   * @returns The access token if login is successful, or a message indicating invalid credentials.
   */
  async login(userData: UserLoginDto) {
    const user = await this.validateUser(userData.username, userData.password);
    if (user === null) {
      return { message: 'Invalid username or password' };
    }
    const payload = { username: user.username, userId: user._id.toString() };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }
}
