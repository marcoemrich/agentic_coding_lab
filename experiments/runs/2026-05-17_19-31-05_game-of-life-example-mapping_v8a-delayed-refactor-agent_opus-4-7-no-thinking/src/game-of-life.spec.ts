import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('nextGeneration', () => {
  describe('empty input', () => {
    it('returns empty array for empty input', () => {
      expect(nextGeneration([])).toEqual([]);
    });
  });

  describe('Rule 1: Underpopulation (live cell with < 2 neighbors dies)', () => {
    it('a single live cell dies', () => {
      expect(nextGeneration([[0, 0]])).toEqual([]);
    });

    it('two adjacent live cells both die (each has 1 neighbor)', () => {
      expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
    });

    it('a live cell with no neighbors dies', () => {
      const result = nextGeneration([[5, 5], [100, 100]]);
      expectSameCells(result, []);
    });
  });

  describe('Rule 2: Survival (live cell with 2 or 3 neighbors lives)', () => {
    it('live cell with exactly 2 live neighbors survives (blinker middle)', () => {
      // Vertical blinker: middle cell (0,1) has 2 live neighbors → survives
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const result = nextGeneration(gen0);
      expect(normalize(result)).toContain('0,1');
    });

    it('live cell with exactly 3 live neighbors survives (block corner)', () => {
      // In a block, each cell has 3 live neighbors → all survive
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(block);
      expect(normalize(result)).toContain('0,0');
    });

    it('block (still life) is unchanged', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe('Rule 3: Overpopulation (live cell with > 3 neighbors dies)', () => {
    it('center cell with 4 live neighbors dies', () => {
      // ###
      // .#.
      // ###
      const gen0: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(gen0);
      // center (1,1) had 4 neighbors → dies
      expect(normalize(result)).not.toContain('1,1');
    });

    it('center of saturated 3x3 dies from overpopulation', () => {
      // 3x3 fully populated
      const gen0: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(gen0);
      // center (1,1) has 8 live neighbors → dies
      expect(normalize(result)).not.toContain('1,1');
    });
  });

  describe('Rule 4: Reproduction (dead cell with exactly 3 neighbors becomes alive)', () => {
    it('dead cell with exactly 3 live neighbors becomes alive', () => {
      // ##.
      // #..
      // ...
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const result = nextGeneration(gen0);
      // dead (1,1) had 3 live neighbors → becomes alive
      expect(normalize(result)).toContain('1,1');
    });

    it('L-tromino transitions to block', () => {
      // ##.          ##.
      // #..    →     ##.
      // ...          ...
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), expected);
    });

    it('dead cell with only 2 neighbors does not become alive', () => {
      const gen0: Cell[] = [[0, 0], [2, 0]];
      const result = nextGeneration(gen0);
      // (1,0) has 2 live neighbors → stays dead
      expect(normalize(result)).not.toContain('1,0');
    });

    it('dead cell with 4 neighbors does not become alive', () => {
      // .#.
      // #.#
      // .#.
      // center (1,1) has 4 live neighbors → stays dead
      const gen0: Cell[] = [[1, 0], [0, 1], [2, 1], [1, 2]];
      const result = nextGeneration(gen0);
      expect(normalize(result)).not.toContain('1,1');
    });
  });

  describe('Patterns', () => {
    it('blinker oscillates: vertical → horizontal', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), expected);
    });

    it('blinker oscillates: horizontal → vertical (back to original)', () => {
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
      expectSameCells(nextGeneration(gen1), expected);
    });

    it('block remains a block across multiple generations', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      let current = block;
      for (let i = 0; i < 5; i++) {
        current = nextGeneration(current);
        expectSameCells(current, block);
      }
    });

    it('single cell dies', () => {
      expect(nextGeneration([[0, 0]])).toEqual([]);
    });
  });

  describe('Negative coordinates', () => {
    it('handles blinker centered at negative coordinates', () => {
      const gen0: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
      const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
      expectSameCells(nextGeneration(gen0), expected);
    });

    it('handles block at negative coordinates (still life)', () => {
      const block: Cell[] = [[-10, -10], [-9, -10], [-10, -9], [-9, -9]];
      expectSameCells(nextGeneration(block), block);
    });

    it('handles cells spanning positive and negative quadrants', () => {
      // Block straddling origin
      const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe('Infinite grid / sparse representation', () => {
    it('isolated distant cells do not affect each other', () => {
      const gen0: Cell[] = [
        [0, 0], [1, 0], [0, 1], [1, 1], // block at origin
        [1000, 1000],                    // distant lonely cell
      ];
      const result = nextGeneration(gen0);
      // Block survives, distant cell dies
      expectSameCells(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });

    it('produces cells at coordinates beyond original bounds when appropriate', () => {
      // Blinker: vertical → horizontal extends x-range
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const result = nextGeneration(gen0);
      const keys = normalize(result);
      expect(keys).toContain('-1,1');
      expect(keys).toContain('1,1');
    });
  });

  describe('Output format', () => {
    it('returns array of [x, y] tuples', () => {
      const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
      for (const cell of result) {
        expect(Array.isArray(cell)).toBe(true);
        expect(cell).toHaveLength(2);
        expect(typeof cell[0]).toBe('number');
        expect(typeof cell[1]).toBe('number');
      }
    });

    it('does not include duplicate cells in output', () => {
      const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
      const keys = result.map(([x, y]) => `${x},${y}`);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});
