import { describe, it, expect } from 'vitest';
import { add } from './string-calculator';

describe('String Calculator', () => {
  it('returns 0 for empty string', () => {
    expect(add('')).toBe(0);
  });

  it('returns the number itself for a single number', () => {
    expect(add('1')).toBe(1);
  });

  it('returns sum of two comma-separated numbers', () => {
    expect(add('1,2')).toBe(3);
  });

  it('returns sum of multiple comma-separated numbers', () => {
    expect(add('1,2,3')).toBe(6);
  });
});
