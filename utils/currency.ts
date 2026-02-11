/**
 * Formats a number as Papua New Guinea Kina (PGK) currency.
 * Returns a string formatted as K1,234.00 (commas for thousands, periods for decimals).
 * @param amount - The numeric amount to format.
 * @returns The formatted currency string.
 */
export const formatKina = (amount: number): string => {
    return `K${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
