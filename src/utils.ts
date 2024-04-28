/**
 * Formats a given amount of money into a string representation according to the specified currency.
 * @param amount The amount of money to format.
 * @param currency The currency code (e.g., USD, INR) used for formatting.
 * @returns A string representing the formatted currency.
 */
export function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}
