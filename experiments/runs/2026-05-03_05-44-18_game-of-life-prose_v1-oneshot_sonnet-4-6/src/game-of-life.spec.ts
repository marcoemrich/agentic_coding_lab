import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe('Game of Life', () => {
  it('empty grid stays empty', () => {
    expectCells(nextGeneration([]), []);
  });

  it('single cell dies from underpopulation', () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });

  it('two cells die from underpopulation', () => {
    expectCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it('block (2x2 square) stays stable', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('blinker oscillates (horizontal -> vertical)', () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expectCells(nextGeneration(horizontal), vertical);
  });

  it('blinker oscillates (vertical -> horizontal)', () => {
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    expectCells(nextGeneration(vertical), horizontal);
  });

  it('dead cell with exactly 3 neighbors becomes alive', () => {
    // Three cells around [0,0]
    const cells: Cell[] = [[-1, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has('0,0')).toBe(true);
  });

  it('live cell with more than 3 neighbors dies (overpopulation)', () => {
    // Center surrounded by 4 live cells
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has('0,0')).toBe(false);
  });

  it('handles negative coordinates', () => {
    const blinker: Cell[] = [[-2, -1], [-2, 0], [-2, 1]];
    const expected: Cell[] = [[-3, 0], [-2, 0], [-1, 0]];
    expectCells(nextGeneration(blinker), expected);
  });

  it('glider moves correctly after one generation', () => {
    // Standard glider
    const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    const next: Cell[] = [[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]];
    expectCells(nextGeneration(glider), next);
  });
});
