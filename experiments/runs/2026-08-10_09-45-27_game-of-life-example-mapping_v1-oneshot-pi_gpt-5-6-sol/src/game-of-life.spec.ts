import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(new Set(actual.map(String))).toEqual(new Set(expected.map(String)));
  expect(actual).toHaveLength(expected.length);
}

describe('nextGeneration', () => {
  it('returns an empty generation for an empty grid', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a single isolated cell through underpopulation', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills two cells that each have only one neighbor', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('lets live cells with two or three neighbors survive', () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(next).toContainEqual([0, 0]);
    expect(next).toContainEqual([1, 0]);
  });

  it('kills a live cell with more than three neighbors', () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]]);
    expect(next).not.toContainEqual([1, 1]);
  });

  it('reproduces a dead cell with exactly three neighbors', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]), [
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });

  it('oscillates a blinker over two generations', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(nextGeneration(vertical)), vertical);
  });

  it('keeps a block unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('supports negative coordinates', () => {
    expectCells(nextGeneration([[-5, -3], [-5, -2], [-5, -1]]), [
      [-6, -2], [-5, -2], [-4, -2],
    ]);
  });

  it('treats duplicate coordinates as one living cell', () => {
    expect(nextGeneration([[0, 0], [0, 0]])).toEqual([]);
  });

  it('does not mutate its input', () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const snapshot = structuredClone(cells);
    nextGeneration(cells);
    expect(cells).toEqual(snapshot);
  });
});
