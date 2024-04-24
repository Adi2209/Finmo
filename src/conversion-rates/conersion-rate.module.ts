import { Module } from "@nestjs/common";
import { ConversionRatesController } from "./conversion-rates.controller";
import { ConversionRateService } from "./conversion-rate.service";

@Module({
    providers: [ConversionRateService],
    controllers: [ConversionRatesController],
})
export class ConversionRateModule {}