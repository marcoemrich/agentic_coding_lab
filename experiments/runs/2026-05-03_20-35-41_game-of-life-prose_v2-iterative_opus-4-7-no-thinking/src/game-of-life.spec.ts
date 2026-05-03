import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

function toSet(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => `${x},${y}`));
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(toSet(actual)).toEqual(toSet(expected));
}

describe('nextGeneration', () => {
  it('returns no living cells when given an empty grid', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a lone living cell (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills a cell with only one neighbor (underpopulation)', () => {
    const result = nextGeneration([[0, 0], [1, 0]]);
    expect(result).toEqual([]);
  });

  it('keeps cells alive with two neighbors and creates new from three', () => {
    // A blinker (vertical) becomes horizontal
    const blinkerVertical: Cell[] = [[1, 0], [1, 1], [1, 2]];
    const blinkerHorizontal: Cell[] = [[0, 1], [1, 1], [2, 1]];
    expectSameCells(nextGeneration(blinkerVertical), blinkerHorizontal);
  });

  it('blinker oscillates back after two generations', () => {
    const blinkerVertical: Cell[] = [[1, 0], [1, 1], [1, 2]];
    const next = nextGeneration(blinkerVertical);
    const nextNext = nextGeneration(next);
    expectSameCells(nextNext, blinkerVertical);
  });

  it('block pattern is stable (still life)', () => {
    const block: Cell[] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it('kills a cell with four or more neighbors (overpopulation)', () => {
    // Center cell at (1,1) has 4 neighbors
    const cells: Cell[] = [
      [1, 1], // center
      [0, 0], [1, 0], [2, 0], [0, 1],
    ];
    const result = nextGeneration(cells);
    const resultSet = toSet(result);
    expect(resultSet.has('1,1')).toBe(false);
  });

  it('a dead cell with exactly three live neighbors becomes alive (reproduction)', () => {
    // Three cells in an L: (0,0), (1,0), (0,1) — the dead cell at (1,1) has 3 neighbors
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    const resultSet = toSet(result);
    expect(resultSet.has('1,1')).toBe(true);
  });

  it('handles negative coordinates', () => {
    const blinker: Cell[] = [[-1, 0], [-1, -1], [-1, -2]];
    const expected: Cell[] = [[-2, -1], [-1, -1], [0, -1]];
    expectSameCells(nextGeneration(blinker), expected);
  });

  it('glider moves correctly after one generation', () => {
    const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    const expected: Cell[] = [[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]];
    expectSameCells(nextGeneration(glider), expected);
  });

  it('handles duplicate input cells gracefully', () => {
    // Block with duplicates should remain a block
    const block: Cell[] = [[0, 0], [0, 1], [1, 0], [1, 1], [0, 0]];
    const expected: Cell[] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expectSameCells(nextGeneration(block), expected);
  });

  it('handles large coordinate values', () => {
    const cells: Cell[] = [
      [1000000, 1000000],
      [1000001, 1000000],
      [1000000, 1000001],
      [1000001, 1000001],
    ];
    expectSameCells(nextGeneration(cells), cells);
  });
});
