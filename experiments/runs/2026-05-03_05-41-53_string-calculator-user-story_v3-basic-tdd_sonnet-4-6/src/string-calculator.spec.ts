import { describe, it, expect } from 'vitest';
import { add } from './string-calculator';

describe('add', () => {
  it('returns 0 for an empty string', () => {
    expect(add('')).toBe(0);
  });

  it('returns the number itself for a single number', () => {
    expect(add('5')).toBe(5);
  });

  it('returns the sum of two comma-separated numbers', () => {
    expect(add('1,2')).toBe(3);
  });

  it('returns the sum of multiple comma-separated numbers', () => {
    expect(add('1,2,3,4,5')).toBe(15);
  });
});
