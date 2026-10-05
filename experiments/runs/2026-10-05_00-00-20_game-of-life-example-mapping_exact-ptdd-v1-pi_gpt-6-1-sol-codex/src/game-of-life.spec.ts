import { describe, expect, it } from 'vitest';
import { type Cell, nextGeneration } from './game-of-life';

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe('nextGeneration', () => {
  it('empty grid stays empty', () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it('single cell (0,0) dies with zero neighbors', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it('pair [(0,1),(1,1)] dies with one neighbor each', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it('live center (1,1) survives with two neighbors in the survival diagram', () => {
    expectCells(nextGeneration([[0, 1], [1, 1], [2, 1], [1, -1]]),
      [[0, 0], [1, 1], [1, 2], [2, 0]]);
  });
  it('live center (1,1) survives with exactly three neighbors', () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it('live center (1,1) dies with exactly four neighbors', () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it('overpopulation diagram follows Conway rules: six row survivors and births at (1,-1) and (1,3)', () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expectCells(result, [
      [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, -1], [1, 3],
    ]);
  });
  it('three-cell L reproduces at (1,1), forming a block', () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expectCells(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it('dead center stays dead with two neighbors', () => {
    expect(nextGeneration([[0, 1], [2, 1]])).not.toContainEqual([1, 1]);
  });
  it('dead center stays dead with four neighbors', () => {
    expect(nextGeneration([[0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it('vertical blinker becomes [(-1,1),(0,1),(1,1)]', () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), [[-1, 1], [0, 1], [1, 1]]);
  });
  it('blinker returns to [(0,0),(0,1),(0,2)] after two generations', () => {
    const initial: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expectCells(nextGeneration(nextGeneration(initial)), initial);
  });
  it('block [(0,0),(1,0),(0,1),(1,1)] remains unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it('blinker evolves across negative x and y coordinates', () => {
    expectCells(nextGeneration([[-2, -3], [-2, -2], [-2, -1]]),
      [[-3, -2], [-2, -2], [-1, -2]]);
  });
  it('widely separated blinkers evolve independently without a bounded grid', () => {
    expectCells(nextGeneration([
      [-1_000_000_000, -1_000_000_001], [-1_000_000_000, -1_000_000_000], [-1_000_000_000, -999_999_999],
      [1_000_000_000, 999_999_999], [1_000_000_000, 1_000_000_000], [1_000_000_000, 1_000_000_001],
    ]), [
      [-1_000_000_001, -1_000_000_000], [-1_000_000_000, -1_000_000_000], [-999_999_999, -1_000_000_000],
      [999_999_999, 1_000_000_000], [1_000_000_000, 1_000_000_000], [1_000_000_001, 1_000_000_000],
    ]);
  });
});
