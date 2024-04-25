export type ConversionRateRequestType = {
  quoteId: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
};

export type FxRateResponseType = { quoteId: string; expiry_at: string, fxRate: string };

export type FxConversionResponseType = { convertedAmount: number; currency: string};

