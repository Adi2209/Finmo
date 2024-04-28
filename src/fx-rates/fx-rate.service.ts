import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  BASE_URL,
  CACHE_KEY,
  TTL_EXCHANGE_RATE_MILLI_SECS,
  TTL_EXCHANGE_RATE_SECS,
} from 'src/config';
import axios, { AxiosResponse } from 'axios';
import NodeCache from 'node-cache';
import {
  FxConversionResponseType,
  FxRateQuery,
  FxRateResponseType,
} from 'src/types';
import { CrypterService } from 'src/crypter.service';

@Injectable()
export class FxRateService {
  private readonly myCache: NodeCache = new NodeCache();

  private readonly logger: Logger = new Logger('FxRateService');

  public async getFxRates(
    fromCurrency: string,
    toCurrency: string,
  ): Promise<FxRateResponseType> {
    const cacheKey = this.generateCacheKey(fromCurrency, toCurrency);
    const cachedFxRate: FxRateResponseType = this.myCache.get(cacheKey);
    if (cachedFxRate) {
      this.logger.debug('FX Rate found in cache, returning rate from cache');
      return cachedFxRate;
    }
    const query: FxRateQuery = {
      function: 'CURRENCY_EXCHANGE_RATE',
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
    };
    const url = this.getFxRateUrl(query);
    const response: AxiosResponse = await axios.get(url);
    const currentTime = new Date().getTime();
    const fxRateResponse = {
      quoteId: this.getQuoteId(cacheKey),
      expiry_at: this.getExpiryAt(currentTime),
      fxRate:
        response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'],
    };
    if(!fxRateResponse.fxRate){
      throw new BadRequestException('Failed to fetch FX Rates, due to 25 free requests per day reached')
    }
    this.myCache.set(cacheKey, fxRateResponse, TTL_EXCHANGE_RATE_SECS);
    return fxRateResponse;
  }

  public async convertFXRate(
    fromCurrency: string,
    toCurrency: string,
    amount: number,
    quoteId: string,
  ): Promise<FxConversionResponseType> {
    let conversionRate = this.getFxRateFromQuoteId(quoteId);
    if (conversionRate === null) {
      this.logger.warn('No fx rate found for the given quoteId');
      conversionRate = (await this.getFxRates(fromCurrency,toCurrency)).fxRate;
    }
    const convertedAmount = amount * parseFloat(conversionRate);
    return {
      convertedAmount: convertedAmount,
      currency: toCurrency,
      fxRate: conversionRate,
    };
  }

  private getFxRateUrl(query: FxRateQuery): string {
    const queryString = `function=${query.function}&from_currency=${query.fromCurrency}&to_currency=${query.toCurrency}&apikey=${process.env.API_KEY}`;
    const fullUrl = `${BASE_URL}query?${queryString}`;
    return fullUrl;
  }

  private getFxRateFromQuoteId(quoteId: string): string | null {
    const cacheKey = new CrypterService().decrypt(quoteId);
    const cachedFxRate: FxRateResponseType = this.myCache.get(cacheKey);
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
