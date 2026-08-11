import { describe, expect, it } from 'vitest';
import { type Cell, nextGeneration } from './game-of-life';

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const expectCells = (actual: Cell[], expected: Cell[]) =>
  expect(sorted(actual)).toEqual(sorted(expected));

describe('nextGeneration', () => {
  it('keeps an empty grid empty', () => {
    expectCells(nextGeneration([]), []);
  });

  describe('rule 1 - underpopulation', () => {
    it('kills a lone cell', () => {
      expectCells(nextGeneration([[0, 0]]), []);
    });

    it('kills a pair of cells that each have one neighbor', () => {
      expectCells(nextGeneration([[0, 1], [1, 1]]), []);
    });
  });

  describe('rule 2 - survival', () => {
    it('keeps a live cell with exactly two neighbors alive', () => {
      // (0,1) is alive with neighbors (0,0) and (0,2).
      expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toContainEqual([0, 1]);
    });

    it('keeps a live cell with exactly three neighbors alive', () => {
      // (1,1) is alive with neighbors (0,0), (1,0) and (0,1).
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expect(nextGeneration(gen0)).toContainEqual([1, 1]);
    });

    it('leaves a block unchanged', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectCells(nextGeneration(block), block);
    });
  });

  describe('rule 3 - overpopulation', () => {
    it('kills a live cell with four neighbors', () => {
      // The center (1,1) has 4 live neighbors at the diagonal corners.
      const gen0: Cell[] = [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]];
      expect(nextGeneration(gen0)).not.toContainEqual([1, 1]);
    });

    it('kills the center of a filled three-by-three square', () => {
      const gen0: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      expect(nextGeneration(gen0)).not.toContainEqual([1, 1]);
    });
  });

  describe('rule 4 - reproduction', () => {
    it('brings a dead cell with exactly three neighbors to life', () => {
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      expectCells(nextGeneration(gen0), [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });

  describe('patterns', () => {
    it('oscillates a blinker between its two phases', () => {
      const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

      expectCells(nextGeneration(vertical), horizontal);
      expectCells(nextGeneration(horizontal), vertical);
    });

    it('advances a glider to the same shape shifted by one diagonal step', () => {
      const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
      const afterFour = [1, 2, 3, 4].reduce(nextGeneration, glider);

      expectCells(
        afterFour,
        glider.map(([x, y]) => [x + 1, y + 1] as Cell),
      );
    });
  });

  describe('infinite grid', () => {
    it('handles negative coordinates', () => {
      const blinker: Cell[] = [[-10, -5], [-10, -4], [-10, -3]];
      expectCells(nextGeneration(blinker), [[-11, -4], [-10, -4], [-9, -4]]);
    });

    it('handles coordinates far from the origin', () => {
      const block: Cell[] = [
        [1_000_000, 1_000_000], [1_000_001, 1_000_000],
        [1_000_000, 1_000_001], [1_000_001, 1_000_001],
      ];
      expectCells(nextGeneration(block), block);
    });

    it('evolves two distant clusters independently', () => {
      const near: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const far: Cell[] = [[500, 500], [500, 501], [500, 502]];

      expectCells(nextGeneration([...near, ...far]), [
        [-1, 1], [0, 1], [1, 1],
        [499, 501], [500, 501], [501, 501],
      ]);
    });
  });

  describe('input handling', () => {
    it('does not mutate the input array', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const copy = gen0.map(([x, y]) => [x, y] as Cell);

      nextGeneration(gen0);

      expect(gen0).toEqual(copy);
    });

    it('tolerates duplicate coordinates in the input', () => {
      const withDuplicates: Cell[] = [[0, 0], [0, 1], [0, 1], [0, 2]];
      expectCells(nextGeneration(withDuplicates), [[-1, 1], [0, 1], [1, 1]]);
    });

    it('returns each living cell exactly once', () => {
      const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      const keys = result.map(([x, y]) => `${x},${y}`);

      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});
