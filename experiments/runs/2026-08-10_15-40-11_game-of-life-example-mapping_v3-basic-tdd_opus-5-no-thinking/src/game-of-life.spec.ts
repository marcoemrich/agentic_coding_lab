import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const expectCells = (actual: Cell[], expected: Cell[]) =>
  expect(sorted(actual)).toEqual(sorted(expected));

describe('nextGeneration', () => {
  it('returns no cells for an empty grid', () => {
    expectCells(nextGeneration([]), []);
  });

  it('lets a single cell die (underpopulation)', () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });

  it('lets two neighboring cells die (underpopulation)', () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });

  it('keeps a live cell with 2 neighbors alive (survival)', () => {
    // .#.
    // .#.  the center (1,1) is alive with 2 live neighbors
    // .#.
    const cells: Cell[] = [[1, 0], [1, 1], [1, 2]];
    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });

  it('keeps a live cell with 3 neighbors alive (survival)', () => {
    // ##
    // ##  every cell of a block has exactly 3 live neighbors
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(cells), cells);
  });

  it('kills a live cell with more than 3 neighbors (overpopulation)', () => {
    // ###
    // .#.  the center (1,1) has 4 live neighbors
    // ###
    const cells: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });

  it('revives a dead cell with exactly 3 neighbors (reproduction)', () => {
    // ##.
    // #..  the dead cell (1,1) has exactly 3 live neighbors
    // ...
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    expectCells(nextGeneration(cells), [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it('oscillates a blinker between vertical and horizontal', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(horizontal), vertical);
  });

  it('grows into negative coordinates', () => {
    const cells: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    expectCells(nextGeneration(cells), [[-6, -4], [-5, -4], [-4, -4]]);
  });

  it('returns each living cell exactly once', () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map(String)).size).toBe(result.length);
  });
});
