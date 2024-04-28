import { Injectable } from '@nestjs/common';

/**
 * Service responsible for providing the main application logic.
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
