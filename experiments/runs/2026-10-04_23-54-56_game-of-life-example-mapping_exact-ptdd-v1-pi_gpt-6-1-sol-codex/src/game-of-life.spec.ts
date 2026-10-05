import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function expectPopulation(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe('nextGeneration', () => {
  it('empty living grid stays []', () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it('single cell (0,0) dies to []', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it('adjacent cells (0,1),(1,1) both die to []', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it('live center with two neighbors survives', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it('live center with three neighbors survives', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it('live center with four neighbors dies', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1]]))
      .not.toContainEqual([0, 0]);
  });
  it('dead center with exactly three neighbors is born: L becomes block', () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expectPopulation(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it('dead center with two neighbors stays dead', () => {
    expect(nextGeneration([[-1, 0], [1, 0]])).not.toContainEqual([0, 0]);
  });
  it('dead center with four neighbors stays dead', () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1]]))
      .not.toContainEqual([0, 0]);
  });
  it('literal survival diagram follows rules: [(1,-1),(1,0),(0,1),(2,1)]', () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expectPopulation(result, [[1, -1], [1, 0], [0, 1], [2, 1]]);
  });
  it('literal overpopulation diagram follows rules: outer rows plus (1,-1),(1,3)', () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expectPopulation(result, [
      [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, -1], [1, 3],
    ]);
  });
  it('vertical blinker becomes [(-1,1),(0,1),(1,1)]', () => {
    expectPopulation(nextGeneration([[0, 0], [0, 1], [0, 2]]), [[-1, 1], [0, 1], [1, 1]]);
  });
  it('blinker returns to its initial state after two generations', () => {
    const initial: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expectPopulation(nextGeneration(nextGeneration(initial)), initial);
  });
  it('block [(0,0),(1,0),(0,1),(1,1)] stays unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectPopulation(nextGeneration(block), block);
  });
  it('blinker at large negative x and positive y evolves without grid bounds', () => {
    expectPopulation(nextGeneration([
      [-1_000_000_000, 1_000_000_000],
      [-1_000_000_000, 1_000_000_001],
      [-1_000_000_000, 1_000_000_002],
    ]), [
      [-1_000_000_001, 1_000_000_001],
      [-1_000_000_000, 1_000_000_001],
      [-999_999_999, 1_000_000_001],
    ]);
  });
});
