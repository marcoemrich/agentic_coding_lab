import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectCellsEqual(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe('nextGeneration', () => {
  describe('Rule 1: Underpopulation', () => {
    it('a live cell with no neighbors dies', () => {
      expectCellsEqual(nextGeneration([[0, 0]]), []);
    });

    it('a live cell with one neighbor dies (both die)', () => {
      expectCellsEqual(nextGeneration([[0, 1], [1, 1]]), []);
    });

    it('an empty grid stays empty', () => {
      expectCellsEqual(nextGeneration([]), []);
    });
  });

  describe('Rule 2: Survival', () => {
    it('a live cell with exactly 2 live neighbors survives', () => {
      // Center of three in a row
      // (0,0), (1,0), (2,0) — (1,0) has 2 neighbors
      const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
      // (1,0) survives
      expect(result).toContainEqual([1, 0]);
    });

    it('a live cell with exactly 3 live neighbors survives', () => {
      // L-shape: (0,0), (1,0), (0,1), (1,1) — the block. Each has 3 neighbors.
      const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
      expectCellsEqual(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });

  describe('Rule 3: Overpopulation', () => {
    it('a live cell with 4 live neighbors dies', () => {
      // The pattern from prompt:
      // ###
      // .#.
      // ###
      // center (1,1) has 4 live neighbors → dies
      const cells: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(cells);
      expect(result).not.toContainEqual([1, 1]);
    });

    it('a live cell with 8 live neighbors dies', () => {
      // 3x3 fully alive — center has 8 neighbors → dies
      const cells: Cell[] = [];
      for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
          cells.push([x, y]);
        }
      }
      const result = nextGeneration(cells);
      expect(result).not.toContainEqual([1, 1]);
    });
  });

  describe('Rule 4: Reproduction', () => {
    it('a dead cell with exactly 3 live neighbors becomes alive', () => {
      // From prompt:
      // ##.
      // #..
      // ...
      // dead cell (1,1) has exactly 3 live neighbors → becomes alive
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const result = nextGeneration(cells);
      expect(result).toContainEqual([1, 1]);
    });

    it('a dead cell with 2 live neighbors stays dead', () => {
      // Two cells side by side; (0,1) and (2,1) would each have only 1 live neighbor, etc.
      const cells: Cell[] = [[0, 0], [1, 0]];
      const result = nextGeneration(cells);
      // Neither new cells nor any survivors
      expectCellsEqual(result, []);
    });

    it('a dead cell with 4 live neighbors stays dead', () => {
      // Plus-shape: dead cell (1,1) surrounded by 4 cells at cardinal directions
      const cells: Cell[] = [[0, 1], [2, 1], [1, 0], [1, 2]];
      const result = nextGeneration(cells);
      expect(result).not.toContainEqual([1, 1]);
    });
  });

  describe('Pattern: Blinker (oscillator)', () => {
    it('vertical blinker becomes horizontal', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1 = nextGeneration(gen0);
      expectCellsEqual(gen1, [[-1, 1], [0, 1], [1, 1]]);
    });

    it('horizontal blinker becomes vertical', () => {
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const gen2 = nextGeneration(gen1);
      expectCellsEqual(gen2, [[0, 0], [0, 1], [0, 2]]);
    });

    it('blinker oscillates with period 2', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen2 = nextGeneration(nextGeneration(gen0));
      expectCellsEqual(gen2, gen0);
    });
  });

  describe('Pattern: Block (still life)', () => {
    it('a 2x2 block stays unchanged', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectCellsEqual(nextGeneration(block), block);
    });

    it('a 2x2 block stays unchanged over multiple generations', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      let state = block;
      for (let i = 0; i < 5; i++) {
        state = nextGeneration(state);
      }
      expectCellsEqual(state, block);
    });
  });

  describe('Single cell', () => {
    it('a single cell dies', () => {
      expectCellsEqual(nextGeneration([[0, 0]]), []);
    });
  });

  describe('Negative coordinates', () => {
    it('handles cells with negative coordinates', () => {
      const blinker: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
      const result = nextGeneration(blinker);
      expectCellsEqual(result, [[-6, -4], [-5, -4], [-4, -4]]);
    });

    it('handles a block with negative coordinates', () => {
      const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
      expectCellsEqual(nextGeneration(block), block);
    });
  });

  describe('Infinite grid', () => {
    it('can create cells far from origin', () => {
      const blinker: Cell[] = [[1000, 1000], [1000, 1001], [1000, 1002]];
      const result = nextGeneration(blinker);
      expectCellsEqual(result, [[999, 1001], [1000, 1001], [1001, 1001]]);
    });

    it('separate clusters evolve independently', () => {
      // Two blocks far apart — both should remain stable
      const cells: Cell[] = [
        [0, 0], [1, 0], [0, 1], [1, 1],
        [100, 100], [101, 100], [100, 101], [101, 101],
      ];
      expectCellsEqual(nextGeneration(cells), cells);
    });
  });

  describe('Output properties', () => {
    it('returns an empty array for an empty input', () => {
      expect(nextGeneration([])).toEqual([]);
    });

    it('does not include duplicate cells in output', () => {
      const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const result = nextGeneration(cells);
      const seen = new Set<string>();
      for (const [x, y] of result) {
        const key = `${x},${y}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    });
  });
});
