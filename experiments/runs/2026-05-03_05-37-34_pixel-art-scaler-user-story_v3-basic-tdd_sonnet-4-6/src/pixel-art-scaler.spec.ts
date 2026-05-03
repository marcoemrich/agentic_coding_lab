import { describe, it, expect } from 'vitest';
import { scalePixelArt } from './pixel-art-scaler';

describe('scalePixelArt', () => {
  it('returns empty image for empty input', () => {
    expect(scalePixelArt([], 3)).toEqual([]);
  });

  it('returns unchanged copy for scale factor 1', () => {
    const input = [['A', 'B'], ['C', 'D']];
    const result = scalePixelArt(input, 1);
    expect(result).toEqual(input);
    // ensure it's a copy, not the same reference
    expect(result).not.toBe(input);
  });

  it('replicates each pixel horizontally by scale factor', () => {
    const input = [['A', 'B']];
    expect(scalePixelArt(input, 2)).toEqual([
      ['A', 'A', 'B', 'B'],
      ['A', 'A', 'B', 'B'],
    ]);
  });

  it('replicates each row vertically by scale factor', () => {
    const input = [['A'], ['B']];
    expect(scalePixelArt(input, 2)).toEqual([
      ['A', 'A'],
      ['A', 'A'],
      ['B', 'B'],
      ['B', 'B'],
    ]);
  });

  it('scales both horizontally and vertically', () => {
    const input = [
      ['A', 'B'],
      ['C', 'D'],
    ];
    expect(scalePixelArt(input, 2)).toEqual([
      ['A', 'A', 'B', 'B'],
      ['A', 'A', 'B', 'B'],
      ['C', 'C', 'D', 'D'],
      ['C', 'C', 'D', 'D'],
    ]);
  });

  it('scales by factor 3', () => {
    const input = [['X']];
    expect(scalePixelArt(input, 3)).toEqual([
      ['X', 'X', 'X'],
      ['X', 'X', 'X'],
      ['X', 'X', 'X'],
    ]);
  });

  it('preserves exact character values', () => {
    const input = [['!', '@', '#']];
    expect(scalePixelArt(input, 2)).toEqual([
      ['!', '!', '@', '@', '#', '#'],
      ['!', '!', '@', '@', '#', '#'],
    ]);
  });
});
