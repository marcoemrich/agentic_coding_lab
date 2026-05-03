import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function toSet(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => `${x},${y}`));
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(toSet(actual)).toEqual(toSet(expected));
}

describe('nextGeneration', () => {
  it('returns no living cells for an empty grid', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a single living cell with no neighbors (underpopulation)', () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it('kills two adjacent cells (each has only one neighbor)', () => {
    expectSameCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it('keeps a living cell with two live neighbors alive', () => {
    // A block (still life): all four cells have 3 live neighbors
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it('births a dead cell with exactly three live neighbors', () => {
    // Three cells in a row → an L shape births a new cell
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    // (1,1) has three live neighbors and should be born
    const result = nextGeneration(cells);
    expect(toSet(result).has('1,1')).toBe(true);
  });

  it('kills a living cell with more than three live neighbors (overpopulation)', () => {
    // Center cell at (1,1) has 4 neighbors
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]];
    const result = nextGeneration(cells);
    expect(toSet(result).has('1,1')).toBe(false);
  });

  it('oscillates a horizontal blinker into a vertical blinker', () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it('returns the blinker after two generations (period 2)', () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const after1 = nextGeneration(horizontal);
    const after2 = nextGeneration(after1);
    expectSameCells(after2, horizontal);
  });

  it('handles negative coordinates correctly', () => {
    const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    expectSameCells(nextGeneration(block), block);
  });

  it('does not mutate the input array', () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const snapshot = JSON.stringify(cells);
    nextGeneration(cells);
    expect(JSON.stringify(cells)).toEqual(snapshot);
  });

  it('deduplicates duplicate input cells', () => {
    const cells: Cell[] = [[0, 0], [0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(cells);
    const expected: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expectSameCells(result, expected);
  });
});
