export const API_URLS = {
  FX_RATE_URL:
    'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=demo',
};

export const BASE_URL = 'https://www.alphavantage.co/';

export const FX_RATE = 'fx-rate';

export const CACHE_KEY = 'fxRates';

export const TTL_EXCHANGE_RATE_SECS = 30;

export const TTL_EXCHANGE_RATE_MILLI_SECS = 30000;

export const TTL_RATE_LIMITING_MS = 60000;

export const RATE_LIMITS = 100;
