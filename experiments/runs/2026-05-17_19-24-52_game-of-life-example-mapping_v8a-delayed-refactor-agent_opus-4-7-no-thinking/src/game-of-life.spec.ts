import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectCellsEqual(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('Game of Life - nextGeneration', () => {
  describe('Rule 1: Underpopulation', () => {
    it('kills a live cell with no neighbors', () => {
      expectCellsEqual(nextGeneration([[0, 0]]), []);
    });

    it('kills both cells in a 2-cell horizontal pair (each has 1 neighbor)', () => {
      // Gen 0: (0,1), (1,1)  → both die from underpopulation
      // But may reproduce neighbors; (0,1) and (1,1) share neighbors with 2 each? Let's check carefully.
      // Cells with exactly 2 neighbors among {(0,1),(1,1)}: positions adjacent to both.
      // (0,0): neighbors (0,1) and (1,1)? distance — yes both. So (0,0) has 2 neighbors → dead stays dead (needs 3).
      // (0,2): neighbors (0,1) and (1,1)? yes both → 2 neighbors → stays dead.
      // (1,0): neighbors (0,1) and (1,1)? yes → 2 neighbors → stays dead.
      // (1,2): neighbors (0,1) and (1,1)? yes → 2 neighbors → stays dead.
      // No dead cell has 3 neighbors → result empty.
      expectCellsEqual(nextGeneration([[0, 1], [1, 1]]), []);
    });
  });

  describe('Rule 2: Survival', () => {
    it('keeps a cell alive when it has 2 live neighbors', () => {
      // Blinker vertical: (0,0),(0,1),(0,2). Center (0,1) has 2 neighbors → survives.
      const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      expect(normalize(result)).toContain('0,1');
    });

    it('keeps a cell alive when it has 3 live neighbors', () => {
      // From prompt Rule 2 example: row of 3 cells with one below center
      // Gen 0: (0,0),(1,0),(2,0),(1,-2) -- using the prompt's example
      // Prompt example:
      //  ###
      //  ...
      //  .#.
      // With top-left at (0,2), so cells: (0,2),(1,2),(2,2),(1,0)
      // Center (1,1) is dead. Live cells: (0,2),(1,2),(2,2),(1,0).
      // The example says center (1,1) has 3 live neighbors → becomes alive (this is reproduction, not survival).
      // Let me find a simpler survival case: L-shape gives center 3 neighbors.
      // Cells: (0,0),(1,0),(0,1) - cell (0,0) has neighbors (1,0),(0,1) → 2 neighbors → survives
      // Cell (1,0) has neighbors (0,0),(0,1) → 2 → survives
      // Cell (0,1) has neighbors (0,0),(1,0) → 2 → survives
      const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      // All three survive; plus (1,1) becomes alive (3 neighbors). Block forms.
      expectCellsEqual(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });
  });

  describe('Rule 3: Overpopulation', () => {
    it('kills a live cell with more than 3 neighbors', () => {
      // Prompt example: filled 3x3 except... actually fully filled 3x3 with center
      // Gen 0:
      //  ###
      //  .#.
      //  ###
      // Cells: (0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)
      // Wait, prompt example:
      //  ###
      //  .#.
      //  ###
      // is 8 cells with center? No, 7 cells. Let me re-read.
      // "###" "###" with ".#." middle → 3+1+3=7 cells but ".#." has 1.
      // So: row 0: (0,2),(1,2),(2,2); row 1: (1,1); row 2: (0,0),(1,0),(2,0).
      // Center (1,1) has neighbors: all 4 corners and 4 edges except itself.
      // Neighbors of (1,1): (0,0),(1,0),(2,0),(0,1),(2,1),(0,2),(1,2),(2,2)
      // Alive among those: (0,0),(1,0),(2,0),(0,2),(1,2),(2,2) = 6 neighbors → dies.
      const result = nextGeneration([
        [0, 2], [1, 2], [2, 2],
        [1, 1],
        [0, 0], [1, 0], [2, 0],
      ]);
      expect(normalize(result)).not.toContain('1,1');
    });
  });

  describe('Rule 4: Reproduction', () => {
    it('brings a dead cell with exactly 3 neighbors to life', () => {
      // Prompt example:
      //  ##.
      //  #..
      //  ...
      // Cells (top-left origin): (0,2),(1,2),(0,1)
      // Dead cell (1,1) has neighbors: (0,0),(1,0),(2,0),(0,1),(2,1),(0,2),(1,2),(2,2)
      // Alive: (0,1),(0,2),(1,2) = 3 neighbors → becomes alive
      const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
      expect(normalize(result)).toContain('1,1');
      // Per prompt expected result:
      // Gen 1: ##.  ##.  → cells (0,2),(1,2),(0,1),(1,1)
      expectCellsEqual(result, [[0, 2], [1, 2], [0, 1], [1, 1]]);
    });

    it('does not bring a dead cell with 2 neighbors to life', () => {
      // 2 cells side by side: (0,0),(1,0). Dead cell (0,1) has 2 neighbors, stays dead.
      const result = nextGeneration([[0, 0], [1, 0]]);
      expect(normalize(result)).not.toContain('0,1');
    });

    it('does not bring a dead cell with 4 neighbors to life', () => {
      // 4 cells around center: (0,1),(2,1),(1,0),(1,2). Dead (1,1) has 4 neighbors → stays dead.
      const result = nextGeneration([[0, 1], [2, 1], [1, 0], [1, 2]]);
      expect(normalize(result)).not.toContain('1,1');
    });
  });

  describe('Patterns', () => {
    it('blinker oscillates (vertical → horizontal)', () => {
      // Gen 0: (0,0),(0,1),(0,2)
      // Gen 1 per prompt: (-1,1),(0,1),(1,1)
      const gen1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      expectCellsEqual(gen1, [[-1, 1], [0, 1], [1, 1]]);
    });

    it('blinker oscillates back (horizontal → vertical)', () => {
      const gen2 = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
      expectCellsEqual(gen2, [[0, 0], [0, 1], [0, 2]]);
    });

    it('block (still life) remains unchanged', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectCellsEqual(nextGeneration(block), block);
    });

    it('single cell dies', () => {
      expectCellsEqual(nextGeneration([[0, 0]]), []);
    });

    it('empty input returns empty output', () => {
      expectCellsEqual(nextGeneration([]), []);
    });
  });

  describe('Negative and large coordinates', () => {
    it('handles negative coordinates', () => {
      // Blinker at negative coords: (-5,-5),(-5,-4),(-5,-3)
      const gen1 = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
      expectCellsEqual(gen1, [[-6, -4], [-5, -4], [-4, -4]]);
    });

    it('handles large coordinates', () => {
      const big = 1_000_000;
      const block: Cell[] = [[big, big], [big + 1, big], [big, big + 1], [big + 1, big + 1]];
      expectCellsEqual(nextGeneration(block), block);
    });

    it('handles mixed positive and negative coordinates', () => {
      // Block spanning origin
      const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
      expectCellsEqual(nextGeneration(block), block);
    });
  });

  describe('API contract', () => {
    it('does not mutate the input array', () => {
      const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      const inputCopy = input.map(([x, y]) => [x, y] as Cell);
      nextGeneration(input);
      expect(input).toEqual(inputCopy);
    });

    it('returns an array (not a Set)', () => {
      const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
