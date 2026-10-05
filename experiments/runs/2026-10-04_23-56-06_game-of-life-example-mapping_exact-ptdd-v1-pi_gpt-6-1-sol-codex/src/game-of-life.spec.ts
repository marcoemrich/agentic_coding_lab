import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

function coordinates(cells: Cell[]): string[] {
  return cells.map(cell => cell.join(',')).sort();
}

describe('nextGeneration', () => {
  it('empty living grid remains []', () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it('single cell at (0,0) dies with zero neighbors', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it('pair [(0,1),(1,1)] dies with one neighbor each', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it('live center with two neighbors survives', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it('live center with exactly three neighbors survives', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it('survival diagram center (1,1) survives', () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1], [1, -1]])).toContainEqual([1, 1]);
  });
  it('live center with exactly four neighbors dies', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1]]))
      .not.toContainEqual([0, 0]);
  });
  it('overpopulation diagram center (1,1) dies with six neighbors', () => {
    expect(nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]]))
      .not.toContainEqual([1, 1]);
  });
  it('dead (1,1) with three neighbors is born: L becomes block', () => {
    expect(coordinates(nextGeneration([[0, 0], [1, 0], [0, 1]])))
      .toEqual(['0,0', '0,1', '1,0', '1,1']);
  });
  it('dead center with two neighbors stays dead', () => {
    expect(nextGeneration([[-1, 0], [1, 0]])).not.toContainEqual([0, 0]);
  });
  it('dead center with four neighbors stays dead', () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, 1], [0, -1]])).not.toContainEqual([0, 0]);
  });
  it('vertical blinker becomes [(-1,1),(0,1),(1,1)]', () => {
    expect(coordinates(nextGeneration([[0, 0], [0, 1], [0, 2]])))
      .toEqual(['-1,1', '0,1', '1,1']);
  });
  it('blinker returns to original after two generations', () => {
    const initial: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(coordinates(nextGeneration(nextGeneration(initial))))
      .toEqual(['0,0', '0,1', '0,2']);
  });
  it('block [(0,0),(1,0),(0,1),(1,1)] remains unchanged', () => {
    expect(coordinates(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])))
      .toEqual(['0,0', '0,1', '1,0', '1,1']);
  });
  it('blinker evolves at large negative x and y without grid bounds', () => {
    expect(coordinates(nextGeneration([
      [-1000000000, -1000000000],
      [-1000000000, -999999999],
      [-1000000000, -999999998],
    ]))).toEqual(['-1000000000,-999999999', '-1000000001,-999999999', '-999999999,-999999999']);
  });
});
