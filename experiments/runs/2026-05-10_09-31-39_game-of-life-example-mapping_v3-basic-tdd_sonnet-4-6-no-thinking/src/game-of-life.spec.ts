import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
}

describe('Game of Life', () => {
  it('single cell dies (underpopulation)', () => {
    const gen0: Cell[] = [[0, 0]];
    expect(nextGeneration(gen0)).toEqual([]);
  });

  it('Rule 1 - two cells die (underpopulation)', () => {
    const gen0: Cell[] = [[0, 1], [1, 1]];
    expect(nextGeneration(gen0)).toEqual([]);
  });

  it('Rule 2 - survival with 2 neighbors', () => {
    // Block: all cells have 2-3 neighbors, stays the same
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it('Rule 3 - overpopulation kills center cell', () => {
    // 3x3 grid of live cells: center has 8 neighbors -> dies
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const gen1 = nextGeneration(gen0);
    // Center cell (1,1) should not be alive
    expect(gen1.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });

  it('Rule 4 - reproduction: dead cell with 3 neighbors becomes alive', () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const gen1 = nextGeneration(gen0);
    // Dead cell (1,1) has exactly 3 neighbors -> becomes alive
    expect(gen1.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });

  it('blinker oscillator: gen 0 -> gen 1', () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(expected));
  });

  it('blinker oscillator: gen 1 -> gen 2 (back to gen 0)', () => {
    const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sortCells(nextGeneration(gen1))).toEqual(sortCells(expected));
  });

  it('block is still life', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it('empty grid stays empty', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('handles negative coordinates', () => {
    const gen0: Cell[] = [[-1, -1], [0, -1], [-1, 0]];
    const gen1 = nextGeneration(gen0);
    expect(gen1.some(([x, y]) => x === 0 && y === 0)).toBe(true);
  });
});
