import { BadRequestException } from '@nestjs/common';
import cc from 'currency-codes';
import binarySearch from 'binary-search';

/**
 * Utility class for validating currency codes.
 */
export class CurrencyValidator {
  /** Array containing all currency codes. */
  private static readonly currencyCodes: string[] = cc.codes();

  /**
   * Validates an array of currency codes.
   * @param currencies Array of currency codes to validate.
   * @throws BadRequestException If any of the currency codes are invalid.
   */
  public static validate(currencies: string[]): void {
    for (const currency of currencies) {
      if (binarySearch(this.currencyCodes, currency, (a: string, b: string) => a.localeCompare(b)) < 0) {
        throw new BadRequestException(`Invalid Currency code: ${currency}`);
      }
    }
  }
}
