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

@Injectable()
export class AuthenticationService {
  private readonly logger: Logger = new Logger('AuthenticationService');

  constructor(
    @InjectModel('Accounts') private readonly accountsModel: Model<Accounts>,
    private readonly jwtService: JwtService,
  ) {}

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

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      this.logger.warn(error);
      return null;
    }
  }

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
