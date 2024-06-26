export type ConversionRateRequestType = {
  quoteId: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
};

export type FxRateQuery = {
  function: string;
  fromCurrency: string;
  toCurrency: string;
};

export type FxRateResponseType = {
  quoteId: string;
  expiry_at: string;
  fxRate: string;
};

export type FxConversionResponseType = {
  convertedAmount: string;
  currency: string;
  fxRate: string;
};

export type CurrencyAmountMap = { [currency: string]: number };

export type AccountResponseType = {
  id: string;
  username: string;
  email: string;
  balance: CurrencyAmountMap;
};

export type LoginAccountResponseType = {
  id: string;
  username: string;
  email: string;
  accessToken: string;
};
