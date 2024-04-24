import { Injectable, Query } from '@nestjs/common';
import { API_URLS } from 'src/config';
import { ConversionRateQuery, HttpService } from 'src/http/http.service';
import axios, { AxiosResponse, AxiosError } from 'axios';

@Injectable()
export class ConversionRateService {
  public async getConversionRates(
    fromCurrency: string,
    toCurrency: string,
  ): Promise<string> {
		console.log('in service');
    const query: ConversionRateQuery = {
			function: 'CURRENCY_EXCHANGE_RATE',
			fromCurrency: fromCurrency,
			toCurrency: toCurrency
		};
    const url = HttpService.getConversionRateUrl(query);
		const response = await axios.get(url);
		return response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
  }
}
