import { BadRequestException } from '@nestjs/common';
import { CrypterService } from '../crypter.service';

jest.mock('cryptr');

describe('CrypterService', () => {
  let crypterService: CrypterService;

  beforeEach(() => {
    crypterService = new CrypterService();
  });

  describe('constructor', () => {
    it('crypter service to be defined', () => {
      const crypterService = new CrypterService();
      expect(crypterService).toBeDefined()
    });
  });

  describe('encrypt', () => {
    it('should encrypt text', () => {
      const mockEncryptedText = 'mockEncryptedText';
      const encryptSpy = jest
        .spyOn(CrypterService.prototype, 'encrypt')
        .mockReturnValueOnce(mockEncryptedText);
      const encryptedText = crypterService.encrypt('test');
      expect(encryptSpy).toHaveBeenCalledTimes(1);
      expect(encryptedText).toEqual(mockEncryptedText);
    });

    it('should throw BadRequestException if encryption fails', () => {
      let ans;
      try {
        ans = crypterService.encrypt('test');
      } catch (error) {
        expect(ans).toBeUndefined();
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('decrypt', () => {
    it('should decrypt text', () => {
      const mockDecryptedText = 'test';
      const decrptSpy = jest
        .spyOn(CrypterService.prototype, 'decrypt')
        .mockReturnValue(mockDecryptedText);

      const decryptedText = crypterService.decrypt('mockEncryptedText');
      expect(decrptSpy).toHaveBeenCalledTimes(1);
      expect(decryptedText).toEqual(mockDecryptedText);
    });

    it('should throw BadRequestException if decryption fails', () => {
      jest
        .spyOn(CrypterService.prototype, 'decrypt')
        .mockImplementationOnce(() => {
          throw new BadRequestException();
        });
      try {
        crypterService.decrypt('test');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
