import { Injectable } from '@nestjs/common';
import { CACHE_KEY, TTL_EXCHANGE_RATE_MILLI_SECS, TTL_EXCHANGE_RATE_SECS } from 'src/config';
import { FxRateQuery, HttpService } from 'src/http/http.service';
import axios, { AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as NodeCache from 'node-cache';

export type FxRateResponseType = { quoteId: string; expiry_at: string, fxRate: string };

@Injectable()
export class FxRateService {
  private readonly mycache: NodeCache;

  constructor() {
    this.mycache = new NodeCache();
  }

  public async getFxRates(
    fromCurrency: string,
    toCurrency: string,
  ): Promise<FxRateResponseType | null> {
    try {
    console.log('in service');
    const cacheKey = this.generateCacheKey(fromCurrency, toCurrency);
    const cachedFxRate = this.mycache.get(cacheKey) as any;
    if (cachedFxRate) {
      return cachedFxRate;
    }
    const query: FxRateQuery = {
      function: 'CURRENCY_EXCHANGE_RATE',
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
    };
    const url = HttpService.getFxRateUrl(query);
    const response: AxiosResponse = await axios.get(url);
    console.warn('Response.data:->', response.data);
    const exchangeRate =
      response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
    const currentTime = new Date().getTime();
    this.mycache.set(cacheKey, exchangeRate, TTL_EXCHANGE_RATE_SECS);
    return {
      quoteId: this.getQuoteId(),
      expiry_at: this.getExpiryAt(currentTime),
      fxRate: exchangeRate
    };
  }
    catch (error) {
      console.error('Could not get fx rate due to error: ', error);
      return null;
    }

  }
  

  private generateCacheKey(fromCurrency: string, toCurrency: string): string {
    return `${CACHE_KEY}_${fromCurrency}_${toCurrency}`;
  }

  private getQuoteId(): string {
    const randomChars = Math.random().toString(36).substring(2, 8);
    const uuid = uuidv4();
    return randomChars + uuid;
  }

  private getExpiryAt(currentTime: number): string {
    const expiryTimestamp = currentTime + TTL_EXCHANGE_RATE_MILLI_SECS;
    const expiryDate = new Date(expiryTimestamp);
    const intlFormat = new Intl.DateTimeFormat("en-uk", {
      dateStyle: "short",
      timeStyle: "full"
    });
    const formattedExpiry = intlFormat.format(expiryDate);
  
    return formattedExpiry;
  }
}
