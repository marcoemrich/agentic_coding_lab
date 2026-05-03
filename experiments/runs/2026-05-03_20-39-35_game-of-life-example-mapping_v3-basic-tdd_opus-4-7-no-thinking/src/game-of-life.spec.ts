import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life.js';

const sortCells = (cells: [number, number][]): [number, number][] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe('Game of Life - nextGeneration', () => {
  it('returns empty for empty input', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('Rule 1: a single live cell with 0 neighbors dies', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('Rule 1: two adjacent live cells both die (each has 1 neighbor)', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('Rule 2: live cell with 2 neighbors survives', () => {
    // Blinker generation 0 -> generation 1
    // Vertical line at x=0: (0,0), (0,1), (0,2)
    // Center (0,1) has 2 neighbors -> survives
    // (0,0) has 1 neighbor -> dies; (0,2) has 1 neighbor -> dies
    // Reproduction: (-1,1) and (1,1) get exactly 3 neighbors -> born
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });

  it('Rule 3: overpopulation - live cell with > 3 neighbors dies', () => {
    // 3x3 block of live cells:
    // ###
    // ###
    // ###
    // Center (1,1) has 8 neighbors -> dies (overpopulation)
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    // The center (1,1) dies due to overpopulation
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });

  it('Rule 4: reproduction - dead cell with exactly 3 neighbors becomes alive', () => {
    // Pattern:
    // ##.
    // #..
    // ...
    // Coordinates: (0,0),(1,0),(0,1)
    // Expected next:
    // ##.
    // ##.
    // ...
    // Coordinates: (0,0),(1,0),(0,1),(1,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  it('Block (still life) is unchanged', () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it('Blinker oscillates correctly', () => {
    // Gen 0 vertical -> Gen 1 horizontal
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    expect(sortCells(gen1)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
    // Gen 1 horizontal -> Gen 2 vertical (back)
    const gen2 = nextGeneration(gen1);
    expect(sortCells(gen2)).toEqual(sortCells(gen0));
  });

  it('handles negative coordinates', () => {
    // Block at negative coordinates - still life
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it('deduplicates duplicate input cells', () => {
    // Even with duplicates, a single cell should die
    expect(nextGeneration([[0, 0], [0, 0]])).toEqual([]);
  });
});
