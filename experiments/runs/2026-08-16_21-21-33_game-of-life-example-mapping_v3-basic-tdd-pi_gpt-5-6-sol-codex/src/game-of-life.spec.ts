import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function ordered(cells: Cell[]): Cell[] {
  return [...cells].sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(ordered(actual)).toEqual(ordered(expected));
}

describe('nextGeneration', () => {
  it('keeps an empty generation empty', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('births a dead cell that has exactly three live neighbors', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]), [
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });

  it('kills a lone cell through underpopulation', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills two adjacent cells that each have only one neighbor', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('lets a live cell survive with two neighbors', () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });

  it('lets a live cell survive with three neighbors', () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 0]);
  });

  it('kills a live cell with more than three neighbors', () => {
    const result = nextGeneration([
      [1, 1], [0, 0], [1, 0], [2, 0], [0, 1],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });

  it('oscillates a blinker and returns to its original state', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(horizontal), vertical);
  });

  it('preserves a block still life', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('handles negative coordinates on the infinite grid', () => {
    expectCells(nextGeneration([[-4, -3], [-4, -2], [-4, -1]]), [
      [-5, -2], [-4, -2], [-3, -2],
    ]);
  });

  it('handles cells at widely separated coordinates sparsely', () => {
    expect(nextGeneration([[-1_000_000, 1_000_000], [1_000_000, -1_000_000]]))
      .toEqual([]);
  });

  it('treats repeated coordinates as one living cell', () => {
    expect(nextGeneration([[0, 0], [0, 0]])).toEqual([]);
  });

  it('does not mutate the input coordinates or array', () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const original: Cell[] = [[0, 0], [0, 1], [0, 2]];
    nextGeneration(cells);
    expect(cells).toEqual(original);
  });
});
