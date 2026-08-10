import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([x1, y1], [x2, y2]) => y1 - y2 || x1 - x2);
}

function expectCells(input: Cell[], expected: Cell[]): void {
  expect(sorted(nextGeneration(input))).toEqual(sorted(expected));
}

describe('nextGeneration', () => {
  it('returns an empty generation from an empty generation', () => {
    expectCells([], []);
  });

  it.each([
    { cells: [[0, 0]] as Cell[] },
    { cells: [[0, 1], [1, 1]] as Cell[] },
  ])('kills cells with fewer than two neighbors', ({ cells }) => {
    expectCells(cells, []);
  });

  it('keeps a live cell with two neighbors', () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });

  it('keeps live cells with three neighbors', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(block, block);
  });

  it('kills an overpopulated cell', () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });

  it('reproduces a dead cell with exactly three neighbors', () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });

  it('oscillates a blinker over two generations', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(vertical, horizontal);
    expectCells(nextGeneration(vertical), vertical);
  });

  it('preserves a block still life', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(block, block);
  });

  it('supports negative and large coordinates on an infinite sparse grid', () => {
    const blinker: Cell[] = [[-10_000, -6], [-10_000, -5], [-10_000, -4]];
    expectCells(blinker, [[-10_001, -5], [-10_000, -5], [-9_999, -5]]);
  });

  it('does not count duplicate input coordinates as separate living cells', () => {
    expectCells([[0, 0], [0, 0], [1, 0], [0, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
});
