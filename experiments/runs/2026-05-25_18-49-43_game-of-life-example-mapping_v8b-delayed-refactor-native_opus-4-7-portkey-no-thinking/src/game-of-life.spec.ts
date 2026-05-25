import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('Game of Life - nextGeneration', () => {
  describe('Rule 1 — Underpopulation: live cell with < 2 neighbors dies', () => {
    it('two horizontally adjacent live cells (each has 1 neighbor) both die → []', () => {
      const input: Cell[] = [[0, 1], [1, 1]];
      expectSameCells(nextGeneration(input), []);
    });

    it('single isolated live cell (0 neighbors) dies → []', () => {
      const input: Cell[] = [[0, 0]];
      expectSameCells(nextGeneration(input), []);
    });
  });

  describe('Rule 2 — Survival: live cell with 2 or 3 neighbors lives on', () => {
    it('live cell with 2 neighbors (block corner) survives', () => {
      // Each cell of a 2x2 block has 3 live neighbors → all survive (block still life)
      // Verified separately in block test below. Here: center of blinker (0,1)
      // has 2 live neighbors and survives.
      const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const result = nextGeneration(input);
      const set = new Set(result.map(([x, y]) => `${x},${y}`));
      expect(set.has('0,1')).toBe(true);
    });

    it('live cell with 3 neighbors survives (block corner has 3 live neighbors)', () => {
      // In a 2x2 block, corner (0,0) has neighbors (1,0)(0,1)(1,1) all alive → 3 → survives
      const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(input);
      const set = new Set(result.map(([x, y]) => `${x},${y}`));
      expect(set.has('0,0')).toBe(true);
    });
  });

  describe('Rule 3 — Overpopulation: live cell with > 3 neighbors dies', () => {
    it('center (1,1) of full # frame plus center has 4 neighbors → dies (not in next gen)', () => {
      // Gen 0:  ###
      //         .#.
      //         ###
      const input: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(input);
      const set = new Set(result.map(([x, y]) => `${x},${y}`));
      expect(set.has('1,1')).toBe(false);
    });
  });

  describe('Rule 4 — Reproduction: dead cell with exactly 3 neighbors becomes alive', () => {
    it('dead cell (1,1) with 3 neighbors becomes alive', () => {
      // Gen 0:  ##.
      //         #..
      //         ...
      // Dead (1,1) has neighbors (0,0)(1,0)(0,1) → 3 → becomes alive
      // Expected Gen 1 from spec:
      //   ##.
      //   ##.
      //   ...
      // = [(0,0),(1,0),(0,1),(1,1)]
      const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(input), expected);
    });
  });

  describe('Pattern examples', () => {
    it('Blinker: vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]', () => {
      const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(input), expected);
    });

    it('Blinker oscillates back: horizontal [(-1,1),(0,1),(1,1)] → vertical [(0,0),(0,1),(0,2)]', () => {
      const input: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
      expectSameCells(nextGeneration(input), expected);
    });

    it('Block (still life): [(0,0),(1,0),(0,1),(1,1)] is unchanged', () => {
      const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(input), expected);
    });

    it('Single cell [(0,0)] dies → []', () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe('Empty input', () => {
    it('empty input → empty output', () => {
      expectSameCells(nextGeneration([]), []);
    });
  });

  describe('Negative coordinates / infinite grid', () => {
    it('handles negative coordinates: blinker at negative origin', () => {
      // Vertical blinker at x=-10
      const input: Cell[] = [[-10, -10], [-10, -9], [-10, -8]];
      const expected: Cell[] = [[-11, -9], [-10, -9], [-9, -9]];
      expectSameCells(nextGeneration(input), expected);
    });

    it('grows beyond original bounding box (reproduction at edge)', () => {
      // Block-like sequence: the L-shape from Rule 4 produces a cell at (1,1)
      // already covered. Here verify that cells can appear outside the input's
      // min/max x and y bounds when neighbors warrant it (blinker rotation
      // already does this: input x ∈ {0}, output x ∈ {-1,0,1}).
      const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const result = nextGeneration(input);
      const xs = result.map(([x]) => x);
      expect(Math.min(...xs)).toBe(-1);
      expect(Math.max(...xs)).toBe(1);
    });
  });
});
