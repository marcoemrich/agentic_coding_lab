import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const expectCells = (actual: Cell[], expected: Cell[]) =>
  expect(sorted(actual)).toEqual(sorted(expected));

describe('nextGeneration', () => {
  it('keeps an empty grid empty', () => {
    expectCells(nextGeneration([]), []);
  });

  describe('rule 1 - underpopulation: live cell with fewer than 2 neighbors dies', () => {
    it('kills a lone cell', () => {
      expectCells(nextGeneration([[0, 0]]), []);
    });

    it('kills a pair of cells that each have only 1 neighbor', () => {
      expectCells(nextGeneration([[0, 1], [1, 1]]), []);
    });
  });

  describe('rule 2 - survival: live cell with 2 or 3 neighbors lives on', () => {
    it('lets a cell with 3 neighbors survive', () => {
      // ###
      // .#.   -> the center cell (1,1) has 3 live neighbors
      const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1]];
      expect(sorted(nextGeneration(cells))).toContainEqual([1, 1]);
    });

    it('lets a cell with 2 neighbors survive', () => {
      // a diagonal-free triple where (1,1) has exactly 2 neighbors
      const cells: Cell[] = [[0, 1], [1, 1], [2, 1]];
      expect(sorted(nextGeneration(cells))).toContainEqual([1, 1]);
    });
  });

  describe('rule 3 - overpopulation: live cell with more than 3 neighbors dies', () => {
    it('kills the center cell of a filled 3x3 block', () => {
      // ###
      // .#.  -> center (1,1) has 4 live neighbors
      // ###
      const cells: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
    });
  });

  describe('rule 4 - reproduction: dead cell with exactly 3 neighbors becomes alive', () => {
    it('brings a dead cell with exactly 3 live neighbors to life', () => {
      // ##.
      // #..  -> dead cell (1,1) has exactly 3 live neighbors
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
      expectCells(nextGeneration(cells), [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });
});

describe('patterns', () => {
  it('oscillates a blinker between vertical and horizontal', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(horizontal), vertical);
  });

  it('leaves a block unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('works with negative coordinates', () => {
    const blinker: Cell[] = [[-5, -10], [-5, -9], [-5, -8]];
    expectCells(nextGeneration(blinker), [[-6, -9], [-5, -9], [-4, -9]]);
  });

  it('does not report duplicate cells when a cell is born', () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(next.map(String)).size).toBe(next.length);
  });

  it('deduplicates repeated input coordinates', () => {
    // the same living cell listed twice must not survive twice
    const next = nextGeneration([[0, 1], [1, 1], [2, 1], [1, 1]]);
    expect(new Set(next.map(String)).size).toBe(next.length);
  });

  it('does not mutate the input array', () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    nextGeneration(cells);
    expectCells(cells, [[0, 0], [0, 1], [0, 2]]);
  });
});
