import { Injectable } from '@nestjs/common';
import { CACHE_KEY, TTL_EXCHANGE_RATE_SECS } from 'src/config';
import { FxRateQuery, HttpService } from 'src/http/http.service';
import axios, { AxiosResponse } from 'axios';
import * as NodeCache from 'node-cache';


@Injectable()
export class FxRateService {

  private readonly mycache: NodeCache;

  constructor(){
    this.mycache = new NodeCache();
  }
  
  public async getFxRates(
    fromCurrency: string,
    toCurrency: string, 
  ): Promise<string> {
    console.log('in service');
    const cacheKey = this.generateCacheKey(fromCurrency, toCurrency);
    const cachedFxRate = this.mycache.get(cacheKey) as any;
    if ( cachedFxRate ){
      return cachedFxRate;
    }
    const query: FxRateQuery = {
			function: 'CURRENCY_EXCHANGE_RATE',
			fromCurrency: fromCurrency,
			toCurrency: toCurrency
		};
    const url = HttpService.getFxRateUrl(query);
		const response:AxiosResponse = await axios.get(url);
    console.warn('Response.data:->' , response.data);
    const exchangeRate = response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
    this.mycache.set( cacheKey, exchangeRate, TTL_EXCHANGE_RATE_SECS );
		return exchangeRate;
  }

  private generateCacheKey(fromCurrency: string, toCurrency: string): string {
    return `${CACHE_KEY}_${fromCurrency}_${toCurrency}`;
  }
}
