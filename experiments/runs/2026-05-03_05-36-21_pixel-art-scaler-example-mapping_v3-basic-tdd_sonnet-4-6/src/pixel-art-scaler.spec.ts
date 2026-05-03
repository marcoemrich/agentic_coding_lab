import { describe, it, expect } from 'vitest';
import { scalePixelArt } from './pixel-art-scaler';

describe('scalePixelArt', () => {
  it('returns empty array for empty input', () => {
    expect(scalePixelArt([], 3)).toEqual([]);
  });

  it('scale 1 returns identical copy', () => {
    expect(scalePixelArt(['#.', '.#'], 1)).toEqual(['#.', '.#']);
  });

  it('scale 2 replicates pixels into 2x2 blocks', () => {
    expect(scalePixelArt(['#.', '.#'], 2)).toEqual(['##..', '##..', '..##', '..##']);
  });

  it('scale 3 single row', () => {
    expect(scalePixelArt(['ABC'], 3)).toEqual(['AAABBBCCC', 'AAABBBCCC', 'AAABBBCCC']);
  });

  it('scale 2 single column', () => {
    expect(scalePixelArt(['X', 'Y', 'Z'], 2)).toEqual(['XX', 'XX', 'YY', 'YY', 'ZZ', 'ZZ']);
  });

  it('scale 2 complex pattern', () => {
    expect(scalePixelArt(['#.#', '.#.', '#.#'], 2)).toEqual([
      '##..##',
      '##..##',
      '..##..',
      '..##..',
      '##..##',
      '##..##',
    ]);
  });

  it('scale 4 single pixel', () => {
    expect(scalePixelArt(['@'], 4)).toEqual(['@@@@', '@@@@', '@@@@', '@@@@']);
  });
});
