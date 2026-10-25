/**
 * Reusable International Currency Formatter & Conversion Utilities
 * Complies with Intl.NumberFormat specifications.
 */

// Exchange rate reference (1 CAD ~ 61.5 INR)
export const EXCHANGE_RATES = {
  INR_TO_CAD: 1 / 61.5, // ~0.01626
  CAD_TO_INR: 61.5,
};

/**
 * Format a numeric price using the country and currency conventions
 * @param {number} amount
 * @param {string} [country='India']
 * @param {string} [currencyCode=null]
 * @returns {string} Formatted currency string (e.g. ₹6,75,000 or CA$25,000)
 */
export function formatCurrency(amount, country = 'India', currencyCode = null) {
  if (amount == null || isNaN(amount)) return '';

  const isCanada = country === 'Canada' || currencyCode === 'CAD';
  const locale = isCanada ? 'en-CA' : 'en-IN';
  const currency = currencyCode || (isCanada ? 'CAD' : 'INR');

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback if system locale/currency is unavailable
    const symbol = isCanada ? 'CA$' : '₹';
    return `${symbol}${amount.toLocaleString(locale)}`;
  }
}

/**
 * Converts a price from one currency to another using established exchange rates
 * @param {number} amount
 * @param {'INR' | 'CAD'} fromCurrency
 * @param {'INR' | 'CAD'} toCurrency
 * @returns {number} Converted amount
 */
export function convertPrice(amount, fromCurrency = 'INR', toCurrency = 'INR') {
  if (!amount || fromCurrency === toCurrency) return amount;

  if (fromCurrency === 'INR' && toCurrency === 'CAD') {
    return Math.round(amount * EXCHANGE_RATES.INR_TO_CAD);
  }

  if (fromCurrency === 'CAD' && toCurrency === 'INR') {
    return Math.round(amount * EXCHANGE_RATES.CAD_TO_INR);
  }

  return amount;
}

/**
 * Gets currency symbol for a country
 * @param {string} country
 * @returns {string} '₹' or 'CA$'
 */
export function getCurrencySymbol(country = 'India') {
  return country === 'Canada' ? 'CA$' : '₹';
}

/**
 * Gets ISO currency code for a country
 * @param {string} country
 * @returns {'INR' | 'CAD'}
 */
export function getCurrencyCode(country = 'India') {
  return country === 'Canada' ? 'CAD' : 'INR';
}

export default {
  formatCurrency,
  convertPrice,
  getCurrencySymbol,
  getCurrencyCode,
  EXCHANGE_RATES,
};
