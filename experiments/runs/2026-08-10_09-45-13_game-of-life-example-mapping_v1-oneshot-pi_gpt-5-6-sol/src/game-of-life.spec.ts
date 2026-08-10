import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([x1, y1], [x2, y2]) => y1 - y2 || x1 - x2);

const expectCells = (actual: Cell[], expected: Cell[]): void => {
  expect(sorted(actual)).toEqual(sorted(expected));
};

describe('nextGeneration', () => {
  it('kills cells with fewer than two neighbors', () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
    expectCells(nextGeneration([[0, 0]]), []);
  });

  it('keeps live cells with two or three neighbors alive', () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(next).toContainEqual([1, 0]);
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });

  it('kills a live cell with more than three neighbors', () => {
    const next = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(next).not.toContainEqual([1, 1]);
  });

  it('creates a dead cell with exactly three neighbors', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]), [
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });

  it('oscillates a blinker', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(horizontal), vertical);
  });

  it('leaves a block unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('handles an empty generation and negative coordinates', () => {
    expect(nextGeneration([])).toEqual([]);
    expectCells(nextGeneration([[-2, -2], [-2, -1], [-2, 0]]), [
      [-3, -1], [-2, -1], [-1, -1],
    ]);
  });

  it('treats duplicate coordinates as one living cell', () => {
    expect(nextGeneration([[0, 0], [0, 0]])).toEqual([]);
  });
});
