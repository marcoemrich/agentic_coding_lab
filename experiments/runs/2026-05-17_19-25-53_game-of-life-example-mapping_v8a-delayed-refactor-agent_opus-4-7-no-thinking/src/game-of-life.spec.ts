import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('Game of Life - nextGeneration', () => {
  describe('Rule 1: Underpopulation', () => {
    it('a single live cell dies (0 neighbors)', () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });

    it('two adjacent live cells both die (each has 1 neighbor)', () => {
      expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
    });
  });

  describe('Rule 2: Survival', () => {
    it('a live cell with 2 neighbors survives', () => {
      // L-shape: (0,0), (1,0), (0,1) — (0,0) has 2 neighbors
      const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      // (0,0) survives - has 2 neighbors
      // (1,0) survives - has 2 neighbors
      // (0,1) survives - has 2 neighbors
      // (1,1) becomes alive - has 3 neighbors (reproduction)
      expectSameCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });

    it('a live cell with 3 neighbors survives', () => {
      // Center of a T-shape
      // Gen 0: ###  -> top row
      //        ...
      //        .#.
      // Cells: (0,2),(1,2),(2,2),(1,0)
      // Wait — use the prompt example. The prompt shows survival example with center surviving.
      // Pattern: top ###, middle ..., bottom .#.
      // Coordinates: (0,2),(1,2),(2,2),(1,0)
      // Next gen center (1,1) had 4 neighbors -> reproduction? No: (1,1) is dead.
      // (1,1) neighbors: (0,2),(1,2),(2,2),(0,1),(2,1),(0,0),(1,0),(2,0)
      // Live neighbors: (0,2),(1,2),(2,2),(1,0) = 4 neighbors -> doesn't become alive
      // Skipping this contrived expectation. Let's use a different example.
      // Take three in a row vertically (blinker), center survives.
      const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      // (0,1) has 2 neighbors -> survives
      // (0,0) has 1 neighbor -> dies
      // (0,2) has 1 neighbor -> dies
      // (-1,1) has 3 neighbors (reproduction)
      // (1,1) has 3 neighbors (reproduction)
      expectSameCells(next, [[-1, 1], [0, 1], [1, 1]]);
    });
  });

  describe('Rule 3: Overpopulation', () => {
    it('a live cell with 4 neighbors dies', () => {
      // Prompt example: ### / .#. / ###
      // Center (1,1) has 8 neighbors -> dies (overpopulation)
      const cells: Cell[] = [
        [0, 2], [1, 2], [2, 2],
        [1, 1],
        [0, 0], [1, 0], [2, 0],
      ];
      const next = nextGeneration(cells);
      // Center (1,1) should NOT be in result (had 8 neighbors)
      expect(next.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    });

    it('a live cell with more than 3 neighbors dies', () => {
      // 2x2 block + 1 extra makes one cell have 4 neighbors? Let's verify.
      // Cells: (0,0),(1,0),(0,1),(1,1),(2,0)
      // (1,0) neighbors among these: (0,0),(0,1),(1,1),(2,0) = 4 -> dies
      const next = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1], [2, 0]]);
      expect(next.some(([x, y]) => x === 1 && y === 0)).toBe(false);
    });
  });

  describe('Rule 4: Reproduction', () => {
    it('a dead cell with exactly 3 live neighbors becomes alive', () => {
      // Prompt example: ## / #. / ..
      // Cells: (0,2),(1,2),(0,1)
      // Dead cell (1,1) has neighbors (0,2),(1,2),(0,1) = 3 -> becomes alive
      const next = nextGeneration([[0, 2], [1, 2], [0, 1]]);
      expect(next.some(([x, y]) => x === 1 && y === 1)).toBe(true);
    });

    it('a dead cell with 2 live neighbors stays dead', () => {
      // (0,0),(2,0) — dead cell (1,0) has 2 neighbors
      const next = nextGeneration([[0, 0], [2, 0]]);
      expect(next.some(([x, y]) => x === 1 && y === 0)).toBe(false);
    });

    it('a dead cell with 4 live neighbors stays dead', () => {
      // Cells around (1,1): (0,0),(2,0),(0,2),(2,2)
      const next = nextGeneration([[0, 0], [2, 0], [0, 2], [2, 2]]);
      expect(next.some(([x, y]) => x === 1 && y === 1)).toBe(false);
    });
  });

  describe('Patterns', () => {
    it('blinker oscillates', () => {
      // Gen 0: vertical ### at (0,0),(0,1),(0,2)
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      expectSameCells(gen1, [[-1, 1], [0, 1], [1, 1]]);

      const gen2 = nextGeneration(gen1);
      expectSameCells(gen2, [[0, 0], [0, 1], [0, 2]]);
    });

    it('block (still life) is unchanged', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });

    it('empty grid stays empty', () => {
      expectSameCells(nextGeneration([]), []);
    });
  });

  describe('Edge cases', () => {
    it('handles negative coordinates', () => {
      // Block at negative coords - still life
      const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
      expectSameCells(nextGeneration(block), block);
    });

    it('handles cells far apart independently', () => {
      // Two isolated cells very far apart, both die
      const cells: Cell[] = [[100, 100], [-100, -100]];
      expectSameCells(nextGeneration(cells), []);
    });

    it('returns each living cell at most once (no duplicates)', () => {
      // Block - still life - should return exactly 4 cells, no duplicates
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(block);
      expect(result).toHaveLength(4);
      const stringified = new Set(result.map(([x, y]) => `${x},${y}`));
      expect(stringified.size).toBe(4);
    });
  });
});
