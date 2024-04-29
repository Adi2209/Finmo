import { Test, TestingModule } from '@nestjs/testing';
import { FxRatesController } from '../fx-rates.controller';
import { FxRateService } from '../fx-rate.service';
import { NotFoundException } from '@nestjs/common';
import { FxConversionDto } from '../../dto/fxConversion.dto';
import { FxConversionResponseType } from '../../types';

describe('FxRatesController', () => {
  let controller: FxRatesController;
  let service: FxRateService;

  beforeEach(async () => {
    service = new FxRateService();
    controller = new FxRatesController(service);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FxRatesController],
      providers: [
        {
          provide: FxRateService,
          useValue: {
            getFxRates: jest.fn(),
            convertFXRate: jest.fn()
          },
        },
      ],
    }).compile();

    controller = module.get<FxRatesController>(FxRatesController);
    service = module.get<FxRateService>(FxRateService);
  });

  it('should return FX rates for a given currency pair', async () => {
    const fromCurrency = 'USD';
    const toCurrency = 'EUR';
    const fxRatesMock = {
      fromCurrency,
      toCurrency,
      rate: 1.2,
    };
    (service.getFxRates as jest.Mock).mockResolvedValueOnce(fxRatesMock);
    const response = await controller.getFxRates(fromCurrency, toCurrency);

    expect(response).toEqual(fxRatesMock);
  });

  it('should throw an error if FX rates are not found', async () => {
    const fromCurrency = 'USD';
    const toCurrency = 'EUR';
    (service.getFxRates as jest.Mock).mockRejectedValueOnce(
      new NotFoundException(),
    );

    await expect(
      controller.getFxRates(fromCurrency, toCurrency),
    ).rejects.toThrow(NotFoundException);
  });

  describe('convertFxRate', () => {
    it('should convert the amount from one currency to another successfully', async () => {
      const request = {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        amount: 100,
        quoteId: 'validQuoteId',
      } as FxConversionDto;
      const expectedResult = {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        convertedAmount: 80,
        quoteId: 'validQuoteId',
        fxRate: 123,
      } as unknown as FxConversionResponseType;
      jest
        .spyOn(service, 'convertFXRate')
        .mockResolvedValueOnce(expectedResult);
      const result = await controller.convertFxRate(request);
      expect(result).toEqual(expectedResult);
    });

    it('should handle error when quoteId is expired or invalid', async () => {
      // Arrange
      const request = {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        amount: 100,
        quoteId: 'invalidQuoteId',
      } as FxConversionDto;
      const errorMessage = 'QuoteId is expired or invalid';
      jest
        .spyOn(service, 'convertFXRate')
        .mockRejectedValueOnce(new NotFoundException(errorMessage));
      await expect(controller.convertFxRate(request)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
