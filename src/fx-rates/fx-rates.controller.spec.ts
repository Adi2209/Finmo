import { Test, TestingModule } from '@nestjs/testing';
import { FxRatesController } from './fx-rates.controller';

describe('FxRatesController', () => {
  let controller: FxRatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FxRatesController],
    }).compile();

    controller = module.get<FxRatesController>(FxRatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
