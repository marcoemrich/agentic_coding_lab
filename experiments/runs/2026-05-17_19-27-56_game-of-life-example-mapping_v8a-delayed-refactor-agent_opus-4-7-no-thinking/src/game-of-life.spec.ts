import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('nextGeneration', () => {
  describe('empty input', () => {
    it('returns empty array for empty input', () => {
      expect(nextGeneration([])).toEqual([]);
    });
  });

  describe('Rule 1 - Underpopulation', () => {
    it('a single live cell with 0 neighbors dies', () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });

    it('two adjacent live cells (each with 1 neighbor) both die', () => {
      expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
    });
  });

  describe('Rule 2 - Survival', () => {
    it('a live cell with 2 neighbors survives', () => {
      // Blinker vertical: (0,0), (0,1), (0,2)
      // Center cell (0,1) has 2 live neighbors → survives
      const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      expect(result).toContainEqual([0, 1]);
    });

    it('a live cell with 3 neighbors survives', () => {
      // Block: all 4 cells have 3 neighbors each
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe('Rule 3 - Overpopulation', () => {
    it('a live cell with 4 neighbors dies', () => {
      // Center cell (1,1) surrounded by 4+ neighbors
      // Pattern from prompt: ### / .#. / ### - center has 4 neighbors (corners + sides)
      const cells: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(cells);
      // Center (1,1) should die
      expect(result).not.toContainEqual([1, 1]);
    });
  });

  describe('Rule 4 - Reproduction', () => {
    it('a dead cell with exactly 3 live neighbors becomes alive', () => {
      // Pattern: ## / #. / .. - dead cell (1,1) has 3 live neighbors
      // Live cells: (0,0), (1,0), (0,1)
      const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      expect(result).toContainEqual([1, 1]);
    });

    it('a dead cell with 2 neighbors does not come alive', () => {
      // Two live cells (each with 1 neighbor)
      // The dead cells with 2 neighbors are e.g. cells adjacent to both
      const result = nextGeneration([[0, 0], [2, 0]]);
      // (1,0) has 2 neighbors but should not come alive
      expect(result).not.toContainEqual([1, 0]);
      // Result should be empty (both originals die from underpopulation)
      expectSameCells(result, []);
    });

    it('a dead cell with 4 neighbors does not come alive', () => {
      // 4 cells around a central position
      const cells: Cell[] = [[0, 0], [2, 0], [0, 2], [2, 2]];
      const result = nextGeneration(cells);
      // (1,1) has 4 neighbors but should not come alive
      expect(result).not.toContainEqual([1, 1]);
    });
  });

  describe('Pattern: Blinker (oscillator)', () => {
    it('vertical blinker becomes horizontal', () => {
      // Gen 0: (0,0), (0,1), (0,2) → Gen 1: (-1,1), (0,1), (1,1)
      const gen1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      expectSameCells(gen1, [[-1, 1], [0, 1], [1, 1]]);
    });

    it('horizontal blinker becomes vertical', () => {
      // Gen 1 → Gen 2
      const gen2 = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
      expectSameCells(gen2, [[0, 0], [0, 1], [0, 2]]);
    });

    it('blinker oscillates back to original after 2 generations', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen2 = nextGeneration(nextGeneration(gen0));
      expectSameCells(gen2, gen0);
    });
  });

  describe('Pattern: Block (still life)', () => {
    it('block remains unchanged', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });

    it('block remains unchanged over multiple generations', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      let current = block;
      for (let i = 0; i < 5; i++) {
        current = nextGeneration(current);
      }
      expectSameCells(current, block);
    });
  });

  describe('Negative coordinates', () => {
    it('handles negative coordinates correctly', () => {
      // Blinker centered at negative coordinates
      const cells: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
      const result = nextGeneration(cells);
      expectSameCells(result, [[-6, -4], [-5, -4], [-4, -4]]);
    });

    it('block with negative coordinates stays unchanged', () => {
      const block: Cell[] = [[-10, -10], [-9, -10], [-10, -9], [-9, -9]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe('API contract', () => {
    it('does not mutate the input array', () => {
      const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const inputCopy: Cell[] = input.map(([x, y]) => [x, y]);
      nextGeneration(input);
      expect(input).toEqual(inputCopy);
    });

    it('returns an array of [x, y] tuples', () => {
      const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      for (const cell of result) {
        expect(Array.isArray(cell)).toBe(true);
        expect(cell.length).toBe(2);
        expect(typeof cell[0]).toBe('number');
        expect(typeof cell[1]).toBe('number');
      }
    });
  });

  describe('Glider pattern', () => {
    it('glider moves diagonally after 4 generations', () => {
      // Standard glider pattern
      // .#.
      // ..#
      // ###
      const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
      let current = glider;
      for (let i = 0; i < 4; i++) {
        current = nextGeneration(current);
      }
      // After 4 generations, glider moves by (1, 1)
      const expected: Cell[] = [[2, 1], [3, 2], [1, 3], [2, 3], [3, 3]];
      expectSameCells(current, expected);
    });
  });
});
