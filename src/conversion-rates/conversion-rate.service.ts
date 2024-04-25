import { Injectable, Query } from '@nestjs/common';
import { API_URLS, CACHE_KEY, TTL_EXCHANGE_RATE_SECS } from 'src/config';
import { ConversionRateQuery, HttpService } from 'src/http/http.service';
import axios, { AxiosResponse, AxiosError } from 'axios';
import * as NodeCache from 'node-cache';


@Injectable()
export class ConversionRateService {

  private readonly mycache: NodeCache;

  constructor(){
    this.mycache = new NodeCache();
  }
  
  public async getConversionRates(
    fromCurrency: string,
    toCurrency: string, 
  ): Promise<string> {
    console.log('in service');
    const cacheKey = this.generateCacheKey(fromCurrency, toCurrency);
    const cachedConversionRate = this.mycache.get(cacheKey) as any;
    if ( cachedConversionRate ){
      return cachedConversionRate;
    }
    const query: ConversionRateQuery = {
			function: 'CURRENCY_EXCHANGE_RATE',
			fromCurrency: fromCurrency,
			toCurrency: toCurrency
		};
    const url = HttpService.getConversionRateUrl(query);
		const response:AxiosResponse = await axios.get(url);
    const exchangeRate = response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
    this.mycache.set( cacheKey, exchangeRate, TTL_EXCHANGE_RATE_SECS );
		return exchangeRate;
  }

  private generateCacheKey(fromCurrency: string, toCurrency: string): string {
    return `${CACHE_KEY}_${fromCurrency}_${toCurrency}`;
  }
}
