import { BadRequestException, Injectable } from '@nestjs/common';
import Cryptr from 'cryptr';

@Injectable()
export class CrypterService {
  private readonly cryptr: Cryptr;

  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.CRYPTER_SECRET_KEY;
    this.cryptr = new Cryptr(this.secretKey, {
      saltLength: 1,
      encoding: 'base64',
      pbkdf2Iterations: 100,
    });
  }

  encrypt(text: string): string {
    try {
      return this.cryptr.encrypt(text);
    } catch (error) {
      throw new BadRequestException(
        'Failed to encrypt the text. Please ensure that the input is valid and try again.'
      );
    }
  }

  decrypt(encryptedText: string): string {
    try {
      return this.cryptr.decrypt(encryptedText);
    } catch (error) {
      throw new BadRequestException(
        'Invalid quoteId. It may have been tampered with or was not generated properly. Please ensure that the quoteId is correct and was generated using the required encryption strength.'
      );
    }
  }
}
