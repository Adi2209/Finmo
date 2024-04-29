import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  BASE_URL,
  CACHE_KEY,
  TTL_EXCHANGE_RATE_MS,
  TTL_EXCHANGE_RATE_SECS,
} from '../config';
import axios, { AxiosResponse } from 'axios';
import NodeCache from 'node-cache';
import {
  FxConversionResponseType,
  FxRateQuery,
  FxRateResponseType,
} from '../types';
import { CrypterService } from '../crypter.service';
import { formatCurrency } from '../utils';

/**
 * Service for fetching and managing foreign exchange rates.
 * Provides methods for retrieving FX rates and converting currencies.
 */
@Injectable()
export class FxRateService {
  private readonly myCache: NodeCache = new NodeCache();

  private readonly logger: Logger = new Logger('FxRateService');

  /**
   * Retrieves the foreign exchange rate between two currencies.
   * @param fromCurrency The currency code to convert from.
   * @param toCurrency The currency code to convert to.
   * @returns A promise that resolves to the foreign exchange rate response.
   * @throws BadRequestException Throws a BadRequestException if the API request fails or daily free request limit is reached.
   */
  public async getFxRates(
    fromCurrency: string,
    toCurrency: string,
  ): Promise<FxRateResponseType> {
    const cacheKey = this.generateCacheKey(fromCurrency, toCurrency);
    const cachedFxRate: FxRateResponseType = this.myCache.get(cacheKey);
    if (cachedFxRate) {
      this.logger.log('FX Rate found in cache, returning rate from cache');
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
    if(response.data['Realtime Currency Exchange Rate'] == undefined){
      throw new BadRequestException('Failed to fetch FX Rates, due to 25 free requests per day reached')
    }
    const fxRateResponse = {
      quoteId: this.getQuoteId(cacheKey),
      expiry_at: this.getExpiryAt(currentTime),
      fxRate:
        response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'],
    };

    this.myCache.set(cacheKey, fxRateResponse, TTL_EXCHANGE_RATE_SECS);
    return fxRateResponse;
  }

  /**
   * Converts an amount from one currency to another based on a provided quote ID or by fetching the FX rate.
   * @param fromCurrency The currency code to convert from.
   * @param toCurrency The currency code to convert to.
   * @param amount The amount to convert.
   * @param quoteId The quote ID for fetching the conversion rate from cache.
   * @returns A promise that resolves to the converted amount and rate response.
   */
  public async convertFXRate(
    fromCurrency: string,
    toCurrency: string,
    amount: number,
    quoteId: string,
  ): Promise<FxConversionResponseType> {
    let conversionRate = this.getFxRateFromQuoteId(quoteId);
    if (conversionRate === null) {
      this.logger.warn('No fx rate found in the cache for the given quoteId, fetching from third party API');
      conversionRate = (await this.getFxRates(fromCurrency,toCurrency)).fxRate;
    }
    const convertedAmount = amount * parseFloat(conversionRate);
    const formattedAmount = formatCurrency(convertedAmount, toCurrency);
    return {
      convertedAmount: formattedAmount,
      currency: toCurrency,
      fxRate: conversionRate,
    };
  }

  /**
   * Constructs the URL for fetching the FX rate.
   * @param query The query parameters for the API request.
   * @returns The URL for fetching the FX rate.
   */
  private getFxRateUrl(query: FxRateQuery): string {
    const queryString = `function=${query.function}&from_currency=${query.fromCurrency}&to_currency=${query.toCurrency}&apikey=${process.env.API_KEY}`;
    const fullUrl = `${BASE_URL}query?${queryString}`;
    return fullUrl;
  }

  /**
   * Retrieves the FX rate from cache using the quote ID.
   * @param quoteId The encrypted quote ID used as the cache key.
   * @returns The FX rate corresponding to the quote ID, or null if not found.
   */
  private getFxRateFromQuoteId(quoteId: string): string | null {
    const cacheKey = new CrypterService().decrypt(quoteId);
    const cachedFxRate: FxRateResponseType = this.myCache.get(cacheKey);
    if (!cachedFxRate) {
      return null;
    }

    return cachedFxRate.fxRate;
  }

  /**
   * Generates a cache key based on the currencies being converted.
   * @param fromCurrency The currency code to convert from.
   * @param toCurrency The currency code to convert to.
   * @returns The generated cache key.
   */
  private generateCacheKey(fromCurrency: string, toCurrency: string): string {
    return `${CACHE_KEY}_${fromCurrency}_${toCurrency}`;
  }

  /**
   * Encrypts the cache key to generate a quote ID.
   * @param cacheKey The cache key to encrypt.
   * @returns The encrypted quote ID.
   */
  private getQuoteId(cacheKey: string): string {
    const quoteId = new CrypterService().encrypt(cacheKey);
    return quoteId;
  }

   /**
   * Calculates the expiry timestamp for the cached FX rate.
   * @param currentTime The current timestamp.
   * @returns The formatted expiry timestamp.
   */
  private getExpiryAt(currentTime: number): string {
    const expiryTimestamp = currentTime + TTL_EXCHANGE_RATE_MS;
    const expiryDate = new Date(expiryTimestamp);
    const intlFormat = new Intl.DateTimeFormat('en-uk', {
      dateStyle: 'short',
      timeStyle: 'full',
    });
    const formattedExpiry = intlFormat.format(expiryDate);

    return formattedExpiry;
  }
}
