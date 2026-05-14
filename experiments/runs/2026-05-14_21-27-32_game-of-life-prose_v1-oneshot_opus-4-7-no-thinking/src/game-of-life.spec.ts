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

  it('kills a single isolated cell (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills two adjacent cells (underpopulation)', () => {
    expectSameCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it('keeps a 2x2 block stable (still life)', () => {
    const block: Cell[] = [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it('oscillates a horizontal blinker into a vertical one', () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it('blinker returns to original shape after two generations', () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    expectSameCells(nextGeneration(nextGeneration(horizontal)), horizontal);
  });

  it('handles negative coordinates', () => {
    const blinker: Cell[] = [[-100, -50], [-99, -50], [-98, -50]];
    const expected: Cell[] = [[-99, -51], [-99, -50], [-99, -49]];
    expectSameCells(nextGeneration(blinker), expected);
  });

  it('birth: dead cell with exactly three live neighbors becomes alive', () => {
    // Three cells in an L shape — the empty corner has 3 live neighbors.
    const l: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(l);
    // (1,1) becomes alive, all others have enough neighbors to survive.
    expectSameCells(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it('overpopulation: cell with more than 3 live neighbors dies', () => {
    // Center cell has 4 neighbors.
    const cells: Cell[] = [
      [0, 0],
      [-1, 0], [1, 0],
      [0, -1], [0, 1],
    ];
    const result = nextGeneration(cells);
    // Center (0,0) has 4 neighbors → dies.
    expect(normalize(result)).not.toContain('0,0');
  });

  it('glider moves correctly after one generation', () => {
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const expected: Cell[] = [
      [0, 1], [2, 1],
      [1, 2], [2, 2],
      [1, 3],
    ];
    expectSameCells(nextGeneration(glider), expected);
  });

  it('does not mutate the input', () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const snapshot = JSON.parse(JSON.stringify(input));
    nextGeneration(input);
    expect(input).toEqual(snapshot);
  });

  it('returns no duplicates', () => {
    const blinker: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const result = nextGeneration(blinker);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
