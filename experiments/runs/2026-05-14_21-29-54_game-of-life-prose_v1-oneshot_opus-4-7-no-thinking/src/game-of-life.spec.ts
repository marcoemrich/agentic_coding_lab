import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('nextGeneration', () => {
  it('returns empty for empty input', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a lone live cell (underpopulation)', () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it('kills two adjacent live cells (underpopulation)', () => {
    expectSameCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it('keeps a live cell with two live neighbors', () => {
    // L-shape: (0,0), (1,0), (0,1) — (0,0) has 2 neighbors
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    // Block pattern emerges: (0,0),(1,0),(0,1),(1,1)
    expectSameCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it('a block is a still life', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it('blinker oscillates (horizontal -> vertical)', () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it('kills a live cell with four neighbors (overpopulation)', () => {
    // Center (0,0) surrounded by 4 neighbors in a plus
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const result = nextGeneration(cells);
    // (0,0) has 4 neighbors -> dies
    const resultSet = new Set(normalize(result));
    expect(resultSet.has('0,0')).toBe(false);
  });

  it('a dead cell with exactly three live neighbors becomes alive', () => {
    // Three cells in L: (0,0),(1,0),(0,1) — dead (1,1) has 3 neighbors -> alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(normalize(result)).toContain('1,1');
  });

  it('handles negative coordinates', () => {
    const horizontal: Cell[] = [[-1, -5], [0, -5], [1, -5]];
    const vertical: Cell[] = [[0, -6], [0, -5], [0, -4]];
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it('handles far-apart cells independently', () => {
    // Two isolated blinkers
    const cells: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1000, 1000], [1001, 1000], [1002, 1000],
    ];
    const expected: Cell[] = [
      [1, -1], [1, 0], [1, 1],
      [1001, 999], [1001, 1000], [1001, 1001],
    ];
    expectSameCells(nextGeneration(cells), expected);
  });

  it('glider advances one step correctly', () => {
    // Standard glider
    const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    const next = nextGeneration(glider);
    // Expected next state of the glider
    const expected: Cell[] = [[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]];
    expectSameCells(next, expected);
  });

  it('does not include duplicates in output', () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const keys = normalize(result);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
