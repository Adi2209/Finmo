import { Controller } from '@nestjs/common';
import { ConversionRateQuery, HttpService } from './http.service';

@Controller('http')
export class HttpController {
  constructor(private readonly httpService: HttpService) {}

  getConversionRateUrl(query:ConversionRateQuery): string {
    return HttpService.getConversionRateUrl(query);
  }
}
