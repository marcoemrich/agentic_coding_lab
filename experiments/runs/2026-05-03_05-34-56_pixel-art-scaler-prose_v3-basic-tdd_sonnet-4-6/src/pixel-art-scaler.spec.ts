import { describe, it, expect } from 'vitest';
import { scalePixelArt } from './pixel-art-scaler';

describe('scalePixelArt', () => {
  it('returns empty array for empty input', () => {
    expect(scalePixelArt([], 3)).toEqual([]);
  });

  it('scale factor of 1 returns exact copy', () => {
    const input = [['R', 'G'], ['B', 'W']];
    expect(scalePixelArt(input, 1)).toEqual([['R', 'G'], ['B', 'W']]);
  });

  it('scales a single pixel by factor 2', () => {
    expect(scalePixelArt([['X']], 2)).toEqual([['X', 'X'], ['X', 'X']]);
  });

  it('scales a single pixel by factor 3', () => {
    expect(scalePixelArt([['A']], 3)).toEqual([
      ['A', 'A', 'A'],
      ['A', 'A', 'A'],
      ['A', 'A', 'A'],
    ]);
  });

  it('scales a 1x2 row by factor 2', () => {
    expect(scalePixelArt([['R', 'B']], 2)).toEqual([
      ['R', 'R', 'B', 'B'],
      ['R', 'R', 'B', 'B'],
    ]);
  });

  it('scales a 2x2 grid by factor 2', () => {
    const input = [['R', 'G'], ['B', 'W']];
    expect(scalePixelArt(input, 2)).toEqual([
      ['R', 'R', 'G', 'G'],
      ['R', 'R', 'G', 'G'],
      ['B', 'B', 'W', 'W'],
      ['B', 'B', 'W', 'W'],
    ]);
  });

  it('preserves exact character values', () => {
    const input = [['#', '.'], ['@', '*']];
    expect(scalePixelArt(input, 2)).toEqual([
      ['#', '#', '.', '.'],
      ['#', '#', '.', '.'],
      ['@', '@', '*', '*'],
      ['@', '@', '*', '*'],
    ]);
  });

  it('scales a 3x3 grid by factor 3', () => {
    const input = [['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']];
    const result = scalePixelArt(input, 3);
    expect(result.length).toBe(9);
    expect(result[0].length).toBe(9);
    expect(result[0]).toEqual(['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C']);
    expect(result[3]).toEqual(['D', 'D', 'D', 'E', 'E', 'E', 'F', 'F', 'F']);
  });
});
