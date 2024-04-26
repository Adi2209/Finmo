import { Injectable } from '@nestjs/common';
import {
  CACHE_KEY,
  TTL_EXCHANGE_RATE_MILLI_SECS,
  TTL_EXCHANGE_RATE_SECS,
} from 'src/config';
import { FxRateQuery, HttpService } from 'src/http/http.service';
import axios, { AxiosResponse } from 'axios';
import NodeCache from 'node-cache';
import { FxConversionResponseType, FxRateResponseType } from 'src/types';
import { CrypterService } from 'src/crypter.service';

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
      console.log('in Fx service');
      const cacheKey = this.generateCacheKey(fromCurrency, toCurrency);
      const cachedFxRate = this.mycache.get(cacheKey) as FxRateResponseType;
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
      const currentTime = new Date().getTime();
      const fxRateResponse = {
        quoteId: this.getQuoteId(cacheKey),
        expiry_at: this.getExpiryAt(currentTime),
        fxRate:
          response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'],
      };
      this.mycache.set(cacheKey, fxRateResponse, TTL_EXCHANGE_RATE_SECS);
      console.log("Inside Cache", this.mycache.data);
      return fxRateResponse;
    } catch (error) {
      console.error('Could not get fx rate due to error: ', error);
      return null;
    }
  }

  public async convertFXRate(
    fromCurrency: string,
    toCurrency: string,
    amount: number,
    quoteId: string,
  ): Promise<FxConversionResponseType> {
    console.log('quoteid',quoteId)
    let conversionRate = this.getFxRateFromQuoteId(quoteId);
    if (conversionRate === null) {
      throw new Error('No fx rate found for the given quoteId');
      // conversionRate = (await this.getFxRates(fromCurrency,toCurrency)).fxRate;
    }
    console.log('BUNGIENUENEOCE--------------------------');
    const convertedAmount = amount * parseFloat(conversionRate);
    return { convertedAmount: convertedAmount, currency: toCurrency };
  }

  private getFxRateFromQuoteId(quoteId:string): string | null {
    const cacheKey = new CrypterService().decrypt(quoteId);
    const cachedFxRate = this.mycache.get(cacheKey) as FxRateResponseType;
      if (!cachedFxRate) {
        return null;
      }

    return cachedFxRate.fxRate;

  }

  private generateCacheKey(fromCurrency: string, toCurrency: string): string {
    return `${CACHE_KEY}_${fromCurrency}_${toCurrency}`;
  }

  private getQuoteId(cacheKey: string): string {
    const quoteId = new CrypterService().encrypt(cacheKey);
    return quoteId;
  }

  private getExpiryAt(currentTime: number): string {
    const expiryTimestamp = currentTime + TTL_EXCHANGE_RATE_MILLI_SECS;
    const expiryDate = new Date(expiryTimestamp);
    const intlFormat = new Intl.DateTimeFormat('en-uk', {
      dateStyle: 'short',
      timeStyle: 'full',
    });
    const formattedExpiry = intlFormat.format(expiryDate);

    return formattedExpiry;
  }
}
