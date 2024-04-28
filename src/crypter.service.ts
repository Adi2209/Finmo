import { BadRequestException, Injectable } from '@nestjs/common';
import Cryptr from 'cryptr';

/**
 * Service responsible for encrypting and decrypting text using Cryptr.
 */
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

  /**
   * Encrypts the provided text.
   * @param text The text to encrypt.
   * @returns The encrypted text.
   */
  encrypt(text: string): string {
    try {
      return this.cryptr.encrypt(text);
    } catch (error) {
      throw new BadRequestException(
        'Failed to encrypt the text. Please ensure that the input is valid and try again.',
      );
    }
  }

  /**
   * Decrypts the provided encrypted text.
   * @param encryptedText The encrypted text to decrypt.
   * @returns The decrypted text.
   */
  decrypt(encryptedText: string): string {
    try {
      return this.cryptr.decrypt(encryptedText);
    } catch (error) {
      throw new BadRequestException(
        'Invalid encrypted text. It may have been tampered with or was not generated properly. Please ensure that the encrypted text is correct and was generated using the required encryption strength.',
      );
    }
  }
}
