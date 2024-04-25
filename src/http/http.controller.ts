import { Controller } from '@nestjs/common';
import { FxRateQuery, HttpService } from './http.service';

@Controller('http')
export class HttpController {
  constructor(private readonly httpService: HttpService) {}

  getFxRateUrl(query:FxRateQuery): string {
    return HttpService.getFxRateUrl(query);
  }
}
