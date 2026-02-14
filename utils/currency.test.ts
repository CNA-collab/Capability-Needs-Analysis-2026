import { describe, it, expect } from 'vitest';
import { formatKina } from './currency';

describe('currency', () => {
  describe('formatKina', () => {
    it('should format positive numbers with K prefix and 2 decimal places', () => {
      expect(formatKina(1000)).toBe('K1,000.00');
      expect(formatKina(1234.56)).toBe('K1,234.56');
      expect(formatKina(100)).toBe('K100.00');
    });

    it('should format zero correctly', () => {
      expect(formatKina(0)).toBe('K0.00');
    });

    it('should format small decimal values correctly', () => {
      expect(formatKina(0.99)).toBe('K0.99');
      expect(formatKina(0.5)).toBe('K0.50');
    });

    it('should format large numbers with commas', () => {
      expect(formatKina(1000000)).toBe('K1,000,000.00');
      expect(formatKina(123456789)).toBe('K123,456,789.00');
    });

    it('should handle negative numbers', () => {
      expect(formatKina(-100)).toBe('K-100.00');
      expect(formatKina(-1234.56)).toBe('K-1,234.56');
    });

    it('should round to 2 decimal places', () => {
      expect(formatKina(10.999)).toBe('K11.00');
      expect(formatKina(10.001)).toBe('K10.00');
      expect(formatKina(10.005)).toBe('K10.01');
    });
  });
});
