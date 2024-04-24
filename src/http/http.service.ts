import { Injectable } from '@nestjs/common';
import { API_URLS, BASE_URL, CONVERSION_RATE } from '../config';
import { ConversionRateService } from 'src/conversion-rates/conversion-rate.service';

export type ConversionRateQuery =
	{
		function: string, fromCurrency: string, toCurrency: string
	}

@Injectable()
export class HttpService {

	public static getConversionRateUrl (query: ConversionRateQuery) : string {
		const queryString = `function=${query.function}&from_currency=${query.fromCurrency}&to_currency=${query.toCurrency}&apikey=${process.env.API_KEY}`;
		const fullUrl = `${BASE_URL}query?${queryString}`;
		return fullUrl;
	}
}

/**
 * var url = 'http://localhost:3000/conversion-rates?function=CURRENCY_EXCHANGE_RATE&fromCurrency=USD&toCurrency=JPY&apikey=IEPLM8223DZGZ4EI';
 */