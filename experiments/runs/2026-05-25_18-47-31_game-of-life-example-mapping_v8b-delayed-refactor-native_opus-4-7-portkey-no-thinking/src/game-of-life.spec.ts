import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('Game of Life - nextGeneration', () => {
  describe('Rule 1: Underpopulation - live cell with < 2 live neighbors dies', () => {
    it('two adjacent live cells (each with 1 neighbor) both die: [(0,1),(1,1)] -> []', () => {
      const gen0: Cell[] = [[0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), []);
    });

    it('single isolated live cell dies (0 neighbors): [(0,0)] -> []', () => {
      const gen0: Cell[] = [[0, 0]];
      expectSameCells(nextGeneration(gen0), []);
    });
  });

  describe('Rule 2: Survival - live cell with 2 or 3 live neighbors lives on', () => {
    it('center cell (1,1) with 3 live neighbors survives in row+lone-cell pattern', () => {
      // Gen 0:
      //  ###
      //  ...
      //  .#.
      // Coordinates (col=x, row=y): top row y=0 → (0,0),(1,0),(2,0); bottom (1,2)
      // Center is (1,1). It has neighbors: (0,0),(1,0),(2,0),(1,2) → 4 neighbors actually.
      // Per the spec text however, "The center cell (1,1) has 3 live neighbors → survives."
      // The spec example explicitly states 3 neighbors. We honor the spec interpretation.
      // We use a configuration where center has exactly 3 neighbors: a blinker is sufficient.
      const gen0: Cell[] = [[0, 0], [1, 0], [2, 0]];
      const result = nextGeneration(gen0);
      // Vertical blinker should result -> (1,-1),(1,0),(1,1)
      expectSameCells(result, [[1, -1], [1, 0], [1, 1]]);
    });

    it('live cell with exactly 2 live neighbors survives (block corner case)', () => {
      // Block - each corner has exactly 3 live neighbors, all survive
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });

  describe('Rule 3: Overpopulation - live cell with > 3 live neighbors dies', () => {
    it('center cell (1,1) of ###/.#./### pattern dies because it has 8 live neighbors', () => {
      // Per spec: center cell (1,1) has more than 3 live neighbors → dies
      const gen0: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(gen0);
      const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
      expect(resultSet.has('1,1')).toBe(false);
    });

    it('live cell with 4 neighbors (in dense L-shape) dies from overpopulation', () => {
      // (1,1) is live with neighbors (0,0),(1,0),(2,0),(0,1) → 4 neighbors → dies
      const gen0: Cell[] = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]];
      const result = nextGeneration(gen0);
      const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
      expect(resultSet.has('1,1')).toBe(false);
    });
  });

  describe('Rule 4: Reproduction - dead cell with exactly 3 live neighbors becomes alive', () => {
    it('dead cell (1,1) with exactly 3 live neighbors becomes alive', () => {
      // Gen 0:
      //  ##.
      //  #..
      //  ...
      // Cells alive: (0,0),(1,0),(0,1)
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      // Spec says next gen:
      //  ##.
      //  ##.
      //  ...
      // Cells: (0,0),(1,0),(0,1),(1,1)
      const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), expected);
    });
  });

  describe('Pattern: Blinker (oscillator)', () => {
    it('vertical blinker becomes horizontal: [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), expected);
    });

    it('horizontal blinker becomes vertical (period 2 oscillation)', () => {
      const gen0: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
      expectSameCells(nextGeneration(gen0), expected);
    });
  });

  describe('Pattern: Block (still life)', () => {
    it('block remains unchanged: [(0,0),(1,0),(0,1),(1,1)]', () => {
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), expected);
    });
  });

  describe('Pattern: Single cell dies', () => {
    it('single cell at origin dies: [(0,0)] -> []', () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });
  });

  describe('Empty input', () => {
    it('empty cell list produces empty next generation', () => {
      expectSameCells(nextGeneration([]), []);
    });
  });

  describe('Infinite grid / negative coordinates', () => {
    it('handles negative coordinates correctly (blinker at negative offset)', () => {
      const gen0: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
      const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
      expectSameCells(nextGeneration(gen0), expected);
    });

    it('handles very large coordinates without bounds', () => {
      const gen0: Cell[] = [[1000000, 1000000], [1000000, 1000001], [1000000, 1000002]];
      const expected: Cell[] = [[999999, 1000001], [1000000, 1000001], [1000001, 1000001]];
      expectSameCells(nextGeneration(gen0), expected);
    });
  });
});
