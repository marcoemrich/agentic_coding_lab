import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life.js';

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe('nextGeneration', () => {
  it('returns empty array for empty input', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('Rule 1 - underpopulation: single cell dies', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('Rule 1 - underpopulation: two adjacent cells die (each has 1 neighbor)', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('Rule 2 - survival: cell with 2 neighbors survives (block still life)', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it('Rule 3 - overpopulation: cell with 4 neighbors dies', () => {
    // 3x3 full grid; center (1,1) has 8 neighbors, dies
    const cells: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    // (1,1) should not be in result
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });

  it('Rule 4 - reproduction: dead cell with exactly 3 neighbors becomes alive', () => {
    // Three cells in L-shape; (1,1) has 3 neighbors
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });

  it('Blinker oscillates: vertical -> horizontal', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expectedHorizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(expectedHorizontal));
  });

  it('Blinker oscillates back: horizontal -> vertical', () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const expectedVertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sortCells(nextGeneration(horizontal))).toEqual(sortCells(expectedVertical));
  });

  it('Block is a still life', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it('handles negative coordinates', () => {
    const blinker: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(blinker))).toEqual(sortCells(expected));
  });

  it('does not contain duplicates in output', () => {
    const blinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinker);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('Rule 4 example from prompt - L pattern produces 2x2 block', () => {
    // Gen 0 top row (y=2): ##. → (0,2),(1,2)
    // Gen 0 mid row (y=1): #.. → (0,1)
    // Gen 1 adds (1,1) → 2x2 block at y=1,2
    const cells: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const result = nextGeneration(cells);
    const expected: Cell[] = [[0, 1], [1, 1], [0, 2], [1, 2]];
    expect(sortCells(result)).toEqual(sortCells(expected));
  });
});
