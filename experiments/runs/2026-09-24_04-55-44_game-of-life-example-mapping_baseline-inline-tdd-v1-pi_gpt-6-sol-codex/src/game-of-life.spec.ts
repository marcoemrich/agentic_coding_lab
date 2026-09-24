import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life';

const sorted = (cells: [number, number][]) => cells.map(([x, y]) => `${x},${y}`).sort();

const expectCells = (actual: [number, number][], expected: [number, number][]) => {
  expect(sorted(actual)).toEqual(sorted(expected));
};

describe('nextGeneration', () => {
  it('leaves an empty universe empty', () => {
    expectCells(nextGeneration([]), []);
  });

  it('kills a lone cell from underpopulation', () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });

  it('kills two adjacent cells with only one neighbor each', () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });

  it('keeps a live cell with two neighbors', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [2, 0]]), [[1, 0], [1, -1], [1, 1]]);
  });

  it('keeps a live cell with three neighbors', () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(cells), cells);
  });

  it('kills a live cell with more than three neighbors', () => {
    const result = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    expect(result).not.toContainEqual([0, 0]);
  });

  it('births a dead cell with exactly three neighbors', () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  it('does not birth a dead cell with only two neighbors', () => {
    expectCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it('keeps a block unchanged', () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('oscillates a blinker across two generations, including negative coordinates', () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(nextGeneration(vertical)), vertical);
  });

  it('treats distant clusters independently on a sparse infinite grid', () => {
    const left: [number, number][] = [[-1000000, -5], [-999999, -5], [-999998, -5]];
    const right: [number, number][] = [[1000000, 5], [1000001, 5], [1000002, 5]];
    expectCells(nextGeneration([...left, ...right]), [
      [-999999, -6], [-999999, -5], [-999999, -4],
      [1000001, 4], [1000001, 5], [1000001, 6],
    ]);
  });

  it('counts repeated coordinates as one living cell', () => {
    expectCells(nextGeneration([[0, 0], [0, 0], [1, 0]]), []);
  });

  it('does not modify the input cells', () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    nextGeneration(cells);
    expect(cells).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
});
