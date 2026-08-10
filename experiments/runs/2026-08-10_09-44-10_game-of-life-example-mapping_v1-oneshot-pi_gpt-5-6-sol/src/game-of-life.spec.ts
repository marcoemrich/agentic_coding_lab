import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);

const expectCells = (actual: Cell[], expected: Cell[]): void => {
  expect(sorted(actual)).toEqual(sorted(expected));
};

describe('nextGeneration', () => {
  it('returns an empty generation for no cells', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a lone cell and a pair through underpopulation', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('preserves a live cell having two or three neighbors', () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 0]); // three neighbors
    expect(result).toContainEqual([1, 1]); // three neighbors
  });

  it('kills a cell having more than three neighbors', () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });

  it('reproduces a dead cell having exactly three neighbors', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]), [
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });

  it('oscillates a blinker', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(nextGeneration(vertical)), vertical);
  });

  it('keeps a block unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('works at negative coordinates without mutating its input', () => {
    const cells: Cell[] = [[-3, -2], [-2, -2], [-1, -2]];
    const snapshot = structuredClone(cells);
    expectCells(nextGeneration(cells), [[-2, -3], [-2, -2], [-2, -1]]);
    expect(cells).toEqual(snapshot);
  });

  it('treats duplicate coordinates as a single live cell', () => {
    expect(nextGeneration([[0, 0], [0, 0]])).toEqual([]);
  });
});
