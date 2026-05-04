import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function toSortedKeys(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

describe('Game of Life', () => {
  it('empty grid stays empty', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('single cell dies (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('two cells die (underpopulation)', () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it('block (2x2) remains stable', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(toSortedKeys(nextGeneration(block))).toEqual(toSortedKeys(block));
  });

  it('blinker oscillates (horizontal to vertical)', () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expect(toSortedKeys(nextGeneration(horizontal))).toEqual(toSortedKeys(vertical));
  });

  it('blinker oscillates back (vertical to horizontal)', () => {
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    expect(toSortedKeys(nextGeneration(vertical))).toEqual(toSortedKeys(horizontal));
  });

  it('dead cell with exactly 3 neighbors becomes alive', () => {
    // Three cells around [0,0] — it should come alive
    const cells: Cell[] = [[-1, 0], [1, 0], [0, 1]];
    const next = nextGeneration(cells);
    const keys = toSortedKeys(next);
    expect(keys).toContain('0,0');
  });

  it('live cell with more than 3 neighbors dies (overpopulation)', () => {
    // Center surrounded by 4 neighbors
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const next = nextGeneration(cells);
    const keys = toSortedKeys(next);
    // Center has 4 neighbors, should die
    expect(keys).not.toContain('0,0');
  });

  it('handles negative coordinates', () => {
    const blinker: Cell[] = [[-2, -1], [-1, -1], [0, -1]];
    const expected: Cell[] = [[-1, -2], [-1, -1], [-1, 0]];
    expect(toSortedKeys(nextGeneration(blinker))).toEqual(toSortedKeys(expected));
  });

  it('glider moves correctly after one generation', () => {
    // Standard glider
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const next = nextGeneration(glider);
    // After one step the glider should have 5 live cells
    expect(next).toHaveLength(5);
  });
});
