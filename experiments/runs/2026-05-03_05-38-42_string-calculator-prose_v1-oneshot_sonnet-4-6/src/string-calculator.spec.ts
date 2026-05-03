import { describe, it, expect } from 'vitest';
import { add } from './string-calculator';

describe('add', () => {
  it('returns 0 for empty string', () => {
    expect(add('')).toBe(0);
  });

  it('returns the number itself for a single number', () => {
    expect(add('1')).toBe(1);
    expect(add('5')).toBe(5);
  });

  it('returns the sum of two numbers', () => {
    expect(add('1,2')).toBe(3);
  });

  it('returns the sum of multiple numbers', () => {
    expect(add('1,2,3')).toBe(6);
    expect(add('10,20,30,40')).toBe(100);
  });
});
