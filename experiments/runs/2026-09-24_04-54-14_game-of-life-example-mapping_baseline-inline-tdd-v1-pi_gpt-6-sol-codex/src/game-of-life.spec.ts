import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life';

const sorted = (cells: [number, number][]) =>
  cells.map(([x, y]) => `${x},${y}`).sort();

const expectCells = (actual: [number, number][], expected: [number, number][]) => {
  expect(sorted(actual)).toEqual(sorted(expected));
};

describe('nextGeneration', () => {
  it('keeps an empty grid empty', () => {
    expectCells(nextGeneration([]), []);
  });

  it('kills a lone cell by underpopulation', () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });

  it('kills adjacent cells with only one neighbor each', () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });

  it('preserves a block whose cells each have three neighbors', () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('keeps cells with two neighbors alive', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [2, 0]]), [[1, -1], [1, 0], [1, 1]]);
  });

  it('kills a cell with four neighbors by overpopulation', () => {
    const cross: [number, number][] = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
    expectCells(nextGeneration(cross), [
      [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
    ]);
  });

  it('reproduces into a dead cell with exactly three neighbors', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]),
      [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it('oscillates a blinker across negative x coordinates', () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(nextGeneration(vertical)), vertical);
  });

  it('evolves distant patterns independently with negative y coordinates', () => {
    const block: [number, number][] = [[-100, -100], [-99, -100], [-100, -99], [-99, -99]];
    expectCells(nextGeneration([...block, [1000, 1000]]), block);
  });

  it('treats repeated coordinates as one living cell', () => {
    expectCells(nextGeneration([[0, 0], [0, 0], [1, 0]]), []);
  });
});
