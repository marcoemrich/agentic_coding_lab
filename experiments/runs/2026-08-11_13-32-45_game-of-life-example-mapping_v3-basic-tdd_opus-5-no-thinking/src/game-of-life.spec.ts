import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const expectCells = (actual: Cell[], expected: Cell[]) => {
  expect(sorted(actual)).toEqual(sorted(expected));
};

describe('nextGeneration', () => {
  describe('rule 1 - underpopulation', () => {
    it('kills a single lonely cell', () => {
      expectCells(nextGeneration([[0, 0]]), []);
    });

    it('kills two cells that each have only one neighbor', () => {
      expectCells(nextGeneration([[0, 1], [1, 1]]), []);
    });

    it('returns an empty grid for an empty input', () => {
      expectCells(nextGeneration([]), []);
    });
  });

  describe('rule 2 - survival', () => {
    it('keeps a live cell with exactly three neighbors alive', () => {
      // ###     row y=0
      // .#.     (1,1) is alive with 3 neighbors: (0,0), (1,0), (2,0)
      // ...
      const gen0: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1]];
      expect(nextGeneration(gen0)).toContainEqual([1, 1]);
    });

    it('keeps a cell with exactly two neighbors alive', () => {
      // vertical blinker: center (0,1) has 2 neighbors
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      expect(nextGeneration(gen0)).toContainEqual([0, 1]);
    });
  });

  describe('rule 3 - overpopulation', () => {
    it('kills a cell with more than three neighbors', () => {
      // ###
      // .#.
      // ###   -> center (1,1) has 4 neighbors
      const gen0: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const gen1 = nextGeneration(gen0);
      expect(gen1).not.toContainEqual([1, 1]);
      // On the infinite grid the pattern also reproduces above and below the
      // 3x3 window: (1,-1) and (1,3) each have exactly 3 living neighbors.
      // The mid-row cells (0,1) and (2,1) each have 5 neighbors and stay dead.
      expectCells(gen1, [
        [1, -1],
        [0, 0], [1, 0], [2, 0],
        [0, 2], [1, 2], [2, 2],
        [1, 3],
      ]);
    });
  });

  describe('rule 4 - reproduction', () => {
    it('brings a dead cell with exactly three neighbors to life', () => {
      // ##.
      // #..   -> dead (1,1) has 3 neighbors
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const gen1 = nextGeneration(gen0);
      expect(gen1).toContainEqual([1, 1]);
      expectCells(gen1, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });

    it('does not revive a dead cell with only two neighbors', () => {
      const gen0: Cell[] = [[0, 0], [2, 0]];
      expect(nextGeneration(gen0)).not.toContainEqual([1, 0]);
    });
  });

  describe('patterns', () => {
    it('oscillates the blinker', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      expectCells(gen1, [[-1, 1], [0, 1], [1, 1]]);
      expectCells(nextGeneration(gen1), gen0);
    });

    it('leaves the block unchanged', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectCells(nextGeneration(block), block);
    });
  });

  describe('infinite grid', () => {
    it('handles negative coordinates', () => {
      const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
      expectCells(nextGeneration(block), block);
    });

    it('handles very large coordinates', () => {
      const blinker: Cell[] = [
        [1_000_000, 1_000_000],
        [1_000_000, 1_000_001],
        [1_000_000, 1_000_002],
      ];
      expectCells(nextGeneration(blinker), [
        [999_999, 1_000_001],
        [1_000_000, 1_000_001],
        [1_000_001, 1_000_001],
      ]);
    });

    it('lets a glider travel one step diagonally after four generations', () => {
      const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
      let cells = glider;
      for (let i = 0; i < 4; i++) cells = nextGeneration(cells);
      expectCells(cells, glider.map(([x, y]) => [x + 1, y + 1] as Cell));
    });
  });

  describe('function contract', () => {
    it('does not mutate the input array', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const copy: Cell[] = [[0, 0], [0, 1], [0, 2]];
      nextGeneration(gen0);
      expect(gen0).toEqual(copy);
    });

    it('returns no duplicate cells', () => {
      const gen1 = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      const keys = gen1.map(([x, y]) => `${x},${y}`);
      expect(new Set(keys).size).toBe(keys.length);
    });

    it('ignores duplicate cells in the input', () => {
      const gen0: Cell[] = [[0, 0], [0, 0], [1, 0], [0, 1]];
      expectCells(nextGeneration(gen0), [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });
});
