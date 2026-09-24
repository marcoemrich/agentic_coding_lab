import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual.map(([x, y]) => `${x},${y}`).sort()).toEqual(
    expected.map(([x, y]) => `${x},${y}`).sort(),
  );
}

describe('nextGeneration', () => {
  it('leaves an empty world empty', () => {
    expectCells(nextGeneration([]), []);
  });

  it('kills an isolated cell', () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });

  it('kills two adjacent cells by underpopulation', () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });

  it('keeps a live cell with two neighbors', () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([0, 0]);
  });

  it('keeps a live cell with three neighbors', () => {
    const result = nextGeneration([[0, 0], [-1, -1], [0, -1], [1, -1]]);
    expect(result).toContainEqual([0, 0]);
  });

  it('kills a live cell with four neighbors', () => {
    const result = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    expect(result).not.toContainEqual([0, 0]);
  });

  it('births a dead cell with exactly three neighbors', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]),
      [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it('does not birth cells with fewer than three neighbors', () => {
    expectCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it('does not birth a dead cell with four neighbors', () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1]]))
      .not.toContainEqual([0, 0]);
  });

  it('keeps a block unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('oscillates a blinker over two generations, including negative coordinates', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(nextGeneration(vertical)), vertical);
  });

  it('works across negative x and y coordinates', () => {
    expectCells(nextGeneration([[-4, -5], [-3, -5], [-4, -4]]),
      [[-4, -5], [-3, -5], [-4, -4], [-3, -4]]);
  });

  it('treats repeated coordinates as one living cell', () => {
    expectCells(nextGeneration([[0, 0], [0, 0], [1, 0], [0, 1]]),
      [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
});
