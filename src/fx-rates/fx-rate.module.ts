import { Module } from "@nestjs/common";
import { FxRatesController } from "./fx-rates.controller";
import { FxRateService } from "./fx-rate.service";

@Module({
    providers: [FxRateService],
    controllers: [FxRatesController],
})
export class FxRateModule {}