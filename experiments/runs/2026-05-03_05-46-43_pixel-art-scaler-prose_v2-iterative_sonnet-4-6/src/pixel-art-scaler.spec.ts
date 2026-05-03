import { describe, it, expect } from 'vitest';
import { scalePixelArt } from './pixel-art-scaler';

describe('scalePixelArt', () => {
  it('returns empty output for empty input', () => {
    expect(scalePixelArt([], 3)).toEqual([]);
  });

  it('returns exact copy with scale factor 1', () => {
    const image = [['r', 'g'], ['b', 'w']];
    expect(scalePixelArt(image, 1)).toEqual([['r', 'g'], ['b', 'w']]);
  });

  it('scales a single pixel by factor 2', () => {
    expect(scalePixelArt([['X']], 2)).toEqual([['X', 'X'], ['X', 'X']]);
  });

  it('scales a 1x2 image by factor 2', () => {
    const image = [['A', 'B']];
    expect(scalePixelArt(image, 2)).toEqual([
      ['A', 'A', 'B', 'B'],
      ['A', 'A', 'B', 'B'],
    ]);
  });

  it('scales a 2x2 image by factor 3', () => {
    const image = [['#', '.'], ['.', '#']];
    const result = scalePixelArt(image, 3);
    expect(result).toEqual([
      ['#', '#', '#', '.', '.', '.'],
      ['#', '#', '#', '.', '.', '.'],
      ['#', '#', '#', '.', '.', '.'],
      ['.', '.', '.', '#', '#', '#'],
      ['.', '.', '.', '#', '#', '#'],
      ['.', '.', '.', '#', '#', '#'],
    ]);
  });

  it('preserves exact character values', () => {
    const image = [['@', '!'], ['~', '%']];
    const result = scalePixelArt(image, 2);
    expect(result[0]).toEqual(['@', '@', '!', '!']);
    expect(result[1]).toEqual(['@', '@', '!', '!']);
    expect(result[2]).toEqual(['~', '~', '%', '%']);
    expect(result[3]).toEqual(['~', '~', '%', '%']);
  });
});
