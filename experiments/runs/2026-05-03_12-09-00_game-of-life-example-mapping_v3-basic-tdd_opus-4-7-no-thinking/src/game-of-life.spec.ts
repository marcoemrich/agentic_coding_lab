import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe('Game of Life - nextGeneration', () => {
  it('returns empty for empty input', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('Rule 1 - Underpopulation: a single live cell dies', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('Rule 1 - Underpopulation: two adjacent cells both die (each has 1 neighbor)', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('Rule 2 - Survival: cell with 2 neighbors lives on', () => {
    // Blinker generation: vertical line becomes horizontal line - center stays alive
    const result = sortCells(nextGeneration([[0, 0], [0, 1], [0, 2]]));
    expect(result).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });

  it('Rule 3 - Overpopulation: cell with more than 3 neighbors dies', () => {
    // Full 3x3 - center has 8 neighbors and dies
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    // Center (1,1) should not be in result
    expect(result.find(([x, y]) => x === 1 && y === 1)).toBeUndefined();
  });

  it('Rule 4 - Reproduction: dead cell with exactly 3 neighbors becomes alive', () => {
    // L-shape: (0,0), (1,0), (0,1) - dead cell (1,1) has 3 neighbors
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = sortCells(nextGeneration(gen0));
    expect(result).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  it('Block (still life) remains unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it('Blinker oscillates back to original after 2 generations', () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    const gen2 = nextGeneration(gen1);
    expect(sortCells(gen2)).toEqual(sortCells(gen0));
  });

  it('handles negative coordinates', () => {
    const gen0: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const result = sortCells(nextGeneration(gen0));
    expect(result).toEqual(sortCells([[0, -1], [0, 0], [0, 1]]));
  });

  it('returns no duplicate cells', () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(gen0);
    const seen = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(seen.size).toBe(result.length);
  });
});
