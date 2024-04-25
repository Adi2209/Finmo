import { Injectable } from '@nestjs/common';
import { BASE_URL } from '../config';

export type FxRateQuery =
	{
		function: string, fromCurrency: string, toCurrency: string
	}

@Injectable()
export class HttpService {

	public static getFxRateUrl (query: FxRateQuery) : string {
		const queryString = `function=${query.function}&from_currency=${query.fromCurrency}&to_currency=${query.toCurrency}&apikey=${process.env.API_KEY}`;
		const fullUrl = `${BASE_URL}query?${queryString}`;
		return fullUrl;
	}
}

/**
 * var url = 'http://localhost:3000/fx-rates?function=CURRENCY_EXCHANGE_RATE&fromCurrency=USD&toCurrency=JPY&apikey=IEPLM8223DZGZ4EI';
 */