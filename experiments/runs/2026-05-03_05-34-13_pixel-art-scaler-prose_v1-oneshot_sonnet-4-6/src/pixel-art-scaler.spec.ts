import { describe, it, expect } from 'vitest';
import { scalePixelArt } from './pixel-art-scaler';

describe('scalePixelArt', () => {
  it('returns empty for empty input', () => {
    expect(scalePixelArt([], 3)).toEqual([]);
  });

  it('scale factor of 1 returns exact copy', () => {
    const input = [['A', 'B'], ['C', 'D']];
    expect(scalePixelArt(input, 1)).toEqual([['A', 'B'], ['C', 'D']]);
  });

  it('scales a single pixel by 2', () => {
    expect(scalePixelArt([['X']], 2)).toEqual([['X', 'X'], ['X', 'X']]);
  });

  it('scales a 2x2 grid by 2', () => {
    const input = [['A', 'B'], ['C', 'D']];
    expect(scalePixelArt(input, 2)).toEqual([
      ['A', 'A', 'B', 'B'],
      ['A', 'A', 'B', 'B'],
      ['C', 'C', 'D', 'D'],
      ['C', 'C', 'D', 'D'],
    ]);
  });

  it('scales a 1x3 row by 3', () => {
    const input = [['R', 'G', 'B']];
    expect(scalePixelArt(input, 3)).toEqual([
      ['R', 'R', 'R', 'G', 'G', 'G', 'B', 'B', 'B'],
      ['R', 'R', 'R', 'G', 'G', 'G', 'B', 'B', 'B'],
      ['R', 'R', 'R', 'G', 'G', 'G', 'B', 'B', 'B'],
    ]);
  });

  it('preserves special characters verbatim', () => {
    const input = [['#', '.'], ['@', '*']];
    expect(scalePixelArt(input, 2)).toEqual([
      ['#', '#', '.', '.'],
      ['#', '#', '.', '.'],
      ['@', '@', '*', '*'],
      ['@', '@', '*', '*'],
    ]);
  });
});
