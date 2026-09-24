import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life';

const sorted = (cells: [number, number][]) =>
  cells.map(([x, y]) => `${x},${y}`).sort();

const expectCells = (actual: [number, number][], expected: [number, number][]) => {
  expect(sorted(actual)).toEqual(sorted(expected));
  expect(new Set(sorted(actual)).size).toBe(actual.length);
};

describe('nextGeneration', () => {
  it('keeps an empty world empty', () => {
    expectCells(nextGeneration([]), []);
  });

  it('kills an isolated cell', () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });

  it('kills two cells with only one neighbor each', () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });

  it('keeps a cell with two neighbors alive', () => {
    expectCells(nextGeneration([[-1, 0], [0, 0], [1, 0]]), [
      [0, -1], [0, 0], [0, 1],
    ]);
  });

  it('keeps a cell with three neighbors alive and reproduces into a block', () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('kills a cell with more than three neighbors', () => {
    expectCells(nextGeneration([[0, 0], [0, -1], [1, 0], [0, 1], [-1, 0]]), [
      [-1, -1], [1, -1], [-1, 1], [1, 1],
      [0, -1], [1, 0], [0, 1], [-1, 0],
    ]);
  });

  it('reproduces a dead cell with exactly three neighbors', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]), [
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });

  it('oscillates a blinker across negative coordinates', () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(nextGeneration(vertical)), vertical);
  });

  it('treats repeated coordinates as one living cell', () => {
    expectCells(nextGeneration([[0, 0], [0, 0], [1, 0], [0, 1]]), [
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });

  it('evolves widely separated patterns independently', () => {
    expectCells(nextGeneration([
      [-1000000, -1000000], [-999999, -1000000], [-1000000, -999999], [-999999, -999999],
      [1000000, 1000000],
    ]), [
      [-1000000, -1000000], [-999999, -1000000], [-1000000, -999999], [-999999, -999999],
    ]);
  });
});
