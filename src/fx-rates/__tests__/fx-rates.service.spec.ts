import { BadRequestException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { FxRateService } from '../fx-rate.service';

jest.mock('axios');
describe('FxRateService', () => {
  let fxRateService: FxRateService;

  beforeEach(() => {
    process.env.CRYPTER_SECRET_KEY = 'mockSecret';
    fxRateService = new FxRateService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFxRates', () => {
    it('should return FX rate from cache if available', async () => {
      const fromCurrency = 'USD';
      const toCurrency = 'EUR';
      const cachedFxRate = {
        quoteId:
          'q6Y3WD/VYtdlsPCmzby9u+KON//lrrzEw+kL3XHqVc3CLPB4TwoJxQ8AZmqWCiEr',
        expiry_at: '29/04/2024, 20:48:17 India Standard Time',
        fxRate: '1.20',
      };
      fxRateService['myCache'].set('CACHE_KEY_USD_EUR', cachedFxRate, 3600);
      (axios.get as jest.Mock).mockResolvedValue({
        data: {
          'Realtime Currency Exchange Rate': {
            '5. Exchange Rate': '1.20',
          },
        },
      });
      const result = await fxRateService.getFxRates(fromCurrency, toCurrency);
      expect(result).toBeDefined();
    });

    it('should fetch FX rate from API if not available in cache', async () => {
      const fromCurrency = 'USD';
      const toCurrency = 'EUR';
      const response = {
        data: {
          'Realtime Currency Exchange Rate': {
            '5. Exchange Rate': '1.20',
          },
        },
      };
      (axios.get as jest.Mock).mockResolvedValue(response);

      const result = await fxRateService.getFxRates(fromCurrency, toCurrency);

      expect(result.fxRate).toEqual('1.20');
    });

    it('should throw bad request if API requests per day reached', async () => {
      const fromCurrency = 'USD';
      const toCurrency = 'EUR';
      const response = {
        data: {
          'Realtime Currency Exchange Rate': undefined,
        },
      };
      (axios.get as jest.Mock).mockResolvedValue(response);

      await expect(
        fxRateService.getFxRates(fromCurrency, toCurrency),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if API request fails', async () => {
      const fromCurrency = 'USD';
      const toCurrency = 'EUR';
      (axios.get as jest.Mock).mockRejectedValue(
        new BadRequestException('API request failed'),
      );
      await expect(
        fxRateService.getFxRates(fromCurrency, toCurrency),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('convertFXRate', () => {
    it('should convert amount based on provided quote ID', async () => {
      const fromCurrency = 'USD';
      const toCurrency = 'EUR';
      const amount = 100;
      const quoteId = 'mockedQuoteId';
      fxRateService['getFxRateFromQuoteId'] = jest.fn().mockReturnValue('1.20');

      const result = await fxRateService.convertFXRate(
        fromCurrency,
        toCurrency,
        amount,
        quoteId,
      );

      expect(result.convertedAmount).toEqual('€120.00');
    });

    it('should fetch FX rate from API if quote ID not found in cache', async () => {
      const fromCurrency = 'USD';
      const toCurrency = 'EUR';
      const amount = 100;
      const quoteId =
        'q6Y3WD/VYtdlsPCmzby9u+KON//lrrzEw+kL3XHqVc3CLPB4TwoJxQ8AZmqWCiEr';
      await expect(
        fxRateService.convertFXRate(fromCurrency, toCurrency, amount, quoteId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
