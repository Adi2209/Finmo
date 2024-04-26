import { Injectable } from '@nestjs/common';
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
    return this.cryptr.encrypt(text);
  }

  decrypt(encryptedText: string): string {
    return this.cryptr.decrypt(encryptedText);
  }
}
