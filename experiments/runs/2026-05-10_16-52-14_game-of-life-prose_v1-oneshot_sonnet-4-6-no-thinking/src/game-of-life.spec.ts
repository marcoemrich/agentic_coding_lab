import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life.js';

type Cell = [number, number];

function toSet(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => `${x},${y}`));
}

function expectCells(actual: Cell[], expected: Cell[]) {
  expect(toSet(actual)).toEqual(toSet(expected));
}

describe('Game of Life', () => {
  it('empty grid stays empty', () => {
    expectCells(nextGeneration([]), []);
  });

  it('single cell dies (underpopulation)', () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });

  it('two cells die (underpopulation)', () => {
    expectCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it('block (2x2) is stable', () => {
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
    // Three cells around (0,0)
    const cells: Cell[] = [[-1, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    const resultSet = toSet(result);
    expect(resultSet.has('0,0')).toBe(true);
  });

  it('living cell with more than 3 neighbors dies (overpopulation)', () => {
    // Center cell surrounded by 4+ neighbors
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const result = nextGeneration(cells);
    const resultSet = toSet(result);
    expect(resultSet.has('0,0')).toBe(false);
  });

  it('handles negative coordinates', () => {
    const block: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    expectCells(nextGeneration(block), block);
  });

  it('glider moves correctly after one generation', () => {
    // Standard glider
    const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    const next: Cell[] = [[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]];
    expectCells(nextGeneration(glider), next);
  });
});
