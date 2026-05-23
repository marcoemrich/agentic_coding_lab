import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life.js';

type Cell = [number, number];

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('Game of Life - nextGeneration', () => {
  describe('Rule 1: Underpopulation (live cell with < 2 neighbors dies)', () => {
    it('two horizontally adjacent live cells each with 1 neighbor both die → []', () => {
      const input: Cell[] = [[0, 1], [1, 1]];
      expectSameCells(nextGeneration(input), []);
    });

    it('a single isolated live cell with 0 neighbors dies → []', () => {
      const input: Cell[] = [[0, 0]];
      expectSameCells(nextGeneration(input), []);
    });
  });

  describe('Rule 2: Survival (live cell with 2 or 3 neighbors lives on)', () => {
    it('a live cell with exactly 2 live neighbors survives', () => {
      // (1,1) live, neighbors (0,0) and (2,2) live = 2 neighbors → survives
      const input: Cell[] = [[0, 0], [1, 1], [2, 2]];
      const result = nextGeneration(input);
      expect(normalize(result)).toContain('1,1');
    });

    it('a live cell with exactly 3 live neighbors survives', () => {
      // Block: each live cell has 3 live neighbors → all survive (still life)
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(block);
      // every cell in the block should still be present
      for (const cell of block) {
        expect(normalize(result)).toContain(`${cell[0]},${cell[1]}`);
      }
    });
  });

  describe('Rule 3: Overpopulation (live cell with > 3 neighbors dies)', () => {
    it('center cell (1,1) in a 3x3 full block has 8 neighbors and dies', () => {
      // Gen 0: ###  /  .#.  /  ###  → wait, the spec shows ### / .#. / ### with center (1,1)
      // The center has neighbors at (0,0),(1,0),(2,0),(0,2),(1,2),(2,2) = 6 actually
      // Let me re-read: Gen 0 is ### / .#. / ### meaning rows of "###", ".#.", "###"
      // So live cells at (0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)
      // Center (1,1) has neighbors at all 8 surrounding positions except (0,1) and (2,1) which are dead
      // So center has 6 live neighbors → dies (>3)
      const input: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(input);
      expect(normalize(result)).not.toContain('1,1');
    });

    it('Rule 3 example: Gen 0 ###/.#./### → center (1,1) with 6 neighbors dies, corners survive with 2 neighbors each', () => {
      const input: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      // Computed: corners (0,0),(2,0),(0,2),(2,2) have 2 live neighbors → survive
      // Edges (1,0),(1,2) have 3 live neighbors → survive
      // Dead cell (1,-1) has neighbors (0,0),(1,0),(2,0) = 3 → revives
      // Dead cell (1,3) has neighbors (0,2),(1,2),(2,2) = 3 → revives
      // Center (1,1) has 6 neighbors → dies
      // Dead cells (0,1),(2,1) have 5 neighbors each → stay dead
      const expected: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [0, 2], [1, 2], [2, 2],
        [1, -1], [1, 3],
      ];
      expectSameCells(nextGeneration(input), expected);
    });
  });

  describe('Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)', () => {
    it('Rule 4 example: Gen 0 ##./#../... → Gen 1 ##./##./... (dead (1,1) revives)', () => {
      // Gen 0 live cells: (0,0),(1,0),(0,1)
      const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
      // Gen 1 expected: ##. / ##. / ... → (0,0),(1,0),(0,1),(1,1)
      const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(input), expected);
    });
  });

  describe('Pattern: Blinker (oscillator)', () => {
    it('vertical blinker [(0,0),(0,1),(0,2)] becomes horizontal [(-1,1),(0,1),(1,1)]', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1Expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), gen1Expected);
    });

    it('horizontal blinker [(-1,1),(0,1),(1,1)] becomes vertical [(0,0),(0,1),(0,2)] after one generation', () => {
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const gen2Expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
      expectSameCells(nextGeneration(gen1), gen2Expected);
    });

    it('blinker returns to original state after two generations', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen2 = nextGeneration(nextGeneration(gen0));
      expectSameCells(gen2, gen0);
    });
  });

  describe('Pattern: Block (still life)', () => {
    it('2x2 block [(0,0),(1,0),(0,1),(1,1)] is unchanged in the next generation', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe('Pattern: Single cell dies', () => {
    it('single cell [(0,0)] dies → []', () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe('Empty grid', () => {
    it('empty input produces empty output', () => {
      expectSameCells(nextGeneration([]), []);
    });
  });

  describe('Negative coordinates / infinite grid', () => {
    it('handles a blinker at negative coordinates', () => {
      const gen0: Cell[] = [[-10, -10], [-10, -9], [-10, -8]];
      const gen1Expected: Cell[] = [[-11, -9], [-10, -9], [-9, -9]];
      expectSameCells(nextGeneration(gen0), gen1Expected);
    });

    it('a single isolated cluster far from origin behaves identically to one at origin', () => {
      const farBlock: Cell[] = [[1000, 1000], [1001, 1000], [1000, 1001], [1001, 1001]];
      expectSameCells(nextGeneration(farBlock), farBlock);
    });
  });

  describe('Sparse representation', () => {
    it('does not produce duplicate cells in output', () => {
      const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(input);
      const keys = result.map(([x, y]) => `${x},${y}`);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});
