import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);

const expectCells = (actual: Cell[], expected: Cell[]): void => {
  expect(sorted(actual)).toEqual(sorted(expected));
};

describe('nextGeneration', () => {
  it('keeps an empty generation empty', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a lone cell through underpopulation', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills cells with only one neighbour', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('preserves live cells with two neighbours', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]), [
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });

  it('preserves live cells with three neighbours', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('kills a live cell with more than three neighbours', () => {
    const plus: Cell[] = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
    expect(nextGeneration(plus)).not.toContainEqual([0, 0]);
  });

  it('reproduces a dead cell with exactly three neighbours', () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(next).toContainEqual([1, 1]);
  });

  it('turns a vertical blinker into a horizontal blinker', () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), [
      [-1, 1], [0, 1], [1, 1],
    ]);
  });

  it('returns a blinker to its original state after two generations', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expectCells(nextGeneration(nextGeneration(vertical)), vertical);
  });

  it('supports negative coordinates', () => {
    const block: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    expectCells(nextGeneration(block), block);
  });

  it('supports patterns located far from the origin', () => {
    const block: Cell[] = [
      [1_000_000, -1_000_000], [1_000_001, -1_000_000],
      [1_000_000, -999_999], [1_000_001, -999_999],
    ];
    expectCells(nextGeneration(block), block);
  });
});
