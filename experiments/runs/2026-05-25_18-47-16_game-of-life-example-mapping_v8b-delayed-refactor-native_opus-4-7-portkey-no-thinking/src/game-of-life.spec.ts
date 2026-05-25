import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('Game of Life - nextGeneration', () => {
  describe('Rule 1: Underpopulation (live cell with < 2 neighbors dies)', () => {
    it('two adjacent cells (each with 1 neighbor) both die → []', () => {
      const input: Cell[] = [[0, 1], [1, 1]];
      expectSameCells(nextGeneration(input), []);
    });

    it('a single isolated cell dies → []', () => {
      const input: Cell[] = [[0, 0]];
      expectSameCells(nextGeneration(input), []);
    });
  });

  describe('Rule 2: Survival (live cell with 2 or 3 neighbors lives on)', () => {
    it('block: live cell (0,0) with 3 neighbors survives', () => {
      const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(input);
      expect(normalize(result)).toContain('0,0');
    });

    it('center cell of a blinker survives (2 neighbors)', () => {
      const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const result = nextGeneration(input);
      expect(normalize(result)).toContain('0,1');
    });
  });

  describe('Rule 3: Overpopulation (live cell with > 3 neighbors dies)', () => {
    it('center cell of fully surrounded 3x3 pattern dies (8 neighbors)', () => {
      const input: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(input);
      expect(normalize(result)).not.toContain('1,1');
    });

    it('overpopulation example: ### / .#. / ### → center (1,1) dies', () => {
      const input: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(input);
      expect(normalize(result)).not.toContain('1,1');
    });
  });

  describe('Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)', () => {
    it('dead cell (1,1) with 3 neighbors becomes alive in ## / #.. pattern', () => {
      const input: Cell[] = [[0, 2], [1, 2], [0, 1]];
      const result = nextGeneration(input);
      expect(normalize(result)).toContain('1,1');
    });

    it('dead cell with exactly 2 neighbors does not become alive', () => {
      const input: Cell[] = [[0, 0], [2, 0]];
      const result = nextGeneration(input);
      expect(normalize(result)).not.toContain('1,0');
    });
  });

  describe('Pattern: Blinker (oscillator)', () => {
    it('vertical blinker [(0,0),(0,1),(0,2)] → horizontal blinker [(-1,1),(0,1),(1,1)]', () => {
      const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(input), expected);
    });

    it('horizontal blinker → vertical blinker (period 2)', () => {
      const input: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
      expectSameCells(nextGeneration(input), expected);
    });

    it('blinker returns to original after 2 generations', () => {
      const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const result = nextGeneration(nextGeneration(input));
      expectSameCells(result, input);
    });
  });

  describe('Pattern: Block (still life)', () => {
    it('block [(0,0),(1,0),(0,1),(1,1)] remains unchanged', () => {
      const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(input), input);
    });
  });

  describe('Edge cases', () => {
    it('single cell dies: [(0,0)] → []', () => {
      const input: Cell[] = [[0, 0]];
      expectSameCells(nextGeneration(input), []);
    });

    it('empty input → empty output', () => {
      expectSameCells(nextGeneration([]), []);
    });
  });

  describe('Infinite grid / negative coordinates', () => {
    it('handles negative coordinates (blinker at negative position)', () => {
      const input: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
      const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
      expectSameCells(nextGeneration(input), expected);
    });

    it('grid extends beyond input bounds (reproduction outside live-cell bounding box)', () => {
      const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const result = nextGeneration(input);
      expect(normalize(result)).toContain('-1,1');
      expect(normalize(result)).toContain('1,1');
    });
  });

  describe('Sparse representation', () => {
    it('output contains only living cells (no dead cells)', () => {
      const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(input);
      expect(result.length).toBe(4);
    });

    it('output has no duplicate coordinates', () => {
      const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const result = nextGeneration(input);
      const keys = normalize(result);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});
