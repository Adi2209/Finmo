import { Test, TestingModule } from '@nestjs/testing';
import { ConversionRatesController } from './conversion-rates.controller';

describe('ConversionRatesController', () => {
  let controller: ConversionRatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversionRatesController],
    }).compile();

    controller = module.get<ConversionRatesController>(ConversionRatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
