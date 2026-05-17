import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('nextGeneration', () => {
  describe('Rule 1 - Underpopulation', () => {
    it('a live cell with no neighbors dies', () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });

    it('two adjacent live cells with 1 neighbor each both die', () => {
      expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
    });
  });

  describe('Rule 2 - Survival', () => {
    it('a live cell with 2 neighbors survives', () => {
      // Blinker center: (0,1) has neighbors (0,0) and (0,2)
      const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const result = nextGeneration(input);
      // (0,1) should survive
      expect(normalize(result)).toContain('0,1');
    });

    it('a live cell with 3 neighbors survives', () => {
      // In a block, every cell has 3 live neighbors
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe('Rule 3 - Overpopulation', () => {
    it('a live cell with 4 neighbors dies', () => {
      // Center cell (1,1) surrounded by 4 corners + 4 edges => 8 neighbors, but pick 4
      // Use: center plus 4 orthogonal neighbors: (1,1) has 4 live neighbors
      const input: Cell[] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
      const result = nextGeneration(input);
      // (1,1) should die
      expect(normalize(result)).not.toContain('1,1');
    });

    it('a live cell with 8 neighbors dies', () => {
      // 3x3 fully alive: center has 8 neighbors
      const input: Cell[] = [
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2], [2, 2],
      ];
      const result = nextGeneration(input);
      expect(normalize(result)).not.toContain('1,1');
    });
  });

  describe('Rule 4 - Reproduction', () => {
    it('a dead cell with exactly 3 live neighbors becomes alive', () => {
      // From the prompt example:
      // Gen 0: (0,0), (1,0), (0,1)
      // (1,1) has 3 live neighbors -> becomes alive
      const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const result = nextGeneration(input);
      expect(normalize(result)).toContain('1,1');
    });

    it('a dead cell with 2 live neighbors does NOT become alive', () => {
      const input: Cell[] = [[0, 0], [0, 1]];
      const result = nextGeneration(input);
      // (1,0), (-1,0), (1,1), (-1,1) all have only 2 live neighbors
      expect(normalize(result)).not.toContain('1,0');
      expect(normalize(result)).not.toContain('-1,0');
    });

    it('a dead cell with 4 live neighbors does NOT become alive', () => {
      // (1,1) surrounded by 4 neighbors at corners
      const input: Cell[] = [[0, 0], [2, 0], [0, 2], [2, 2]];
      const result = nextGeneration(input);
      expect(normalize(result)).not.toContain('1,1');
    });
  });

  describe('Pattern - Blinker', () => {
    it('vertical blinker becomes horizontal blinker', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen1Expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), gen1Expected);
    });

    it('horizontal blinker becomes vertical blinker', () => {
      const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
      const gen2Expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
      expectSameCells(nextGeneration(gen1), gen2Expected);
    });

    it('blinker oscillates back to original after 2 generations', () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen2 = nextGeneration(nextGeneration(gen0));
      expectSameCells(gen2, gen0);
    });
  });

  describe('Pattern - Block (still life)', () => {
    it('block stays unchanged', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });

    it('block stays unchanged after multiple generations', () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      let current = block;
      for (let i = 0; i < 5; i++) {
        current = nextGeneration(current);
      }
      expectSameCells(current, block);
    });
  });

  describe('Edge cases', () => {
    it('empty grid stays empty', () => {
      expectSameCells(nextGeneration([]), []);
    });

    it('single cell dies', () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });

    it('handles negative coordinates', () => {
      const input: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
      const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
      expectSameCells(nextGeneration(input), expected);
    });

    it('handles cells far from origin', () => {
      const input: Cell[] = [[1000, 1000], [1000, 1001], [1000, 1002]];
      const expected: Cell[] = [[999, 1001], [1000, 1001], [1001, 1001]];
      expectSameCells(nextGeneration(input), expected);
    });

    it('handles disconnected groups independently', () => {
      // Two blocks far apart - both should stay unchanged
      const input: Cell[] = [
        [0, 0], [1, 0], [0, 1], [1, 1],
        [100, 100], [101, 100], [100, 101], [101, 101],
      ];
      expectSameCells(nextGeneration(input), input);
    });

    it('rule 4 reproduction example from prompt', () => {
      // Gen 0: ##.  →  Gen 1: ##.
      //        #..              ##.
      //        ...              ...
      // Gen 0 coords (using top-left as (0,0) and y going down):
      // (0,0), (1,0), (0,1) -> Gen 1: (0,0), (1,0), (0,1), (1,1)
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
      const gen1Expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(gen0), gen1Expected);
    });
  });

  describe('Input independence', () => {
    it('does not mutate input array', () => {
      const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const inputCopy: Cell[] = [[0, 0], [0, 1], [0, 2]];
      nextGeneration(input);
      expect(input).toEqual(inputCopy);
    });

    it('input order does not affect output', () => {
      const input1: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const input2: Cell[] = [[0, 2], [0, 0], [0, 1]];
      expectSameCells(nextGeneration(input1), nextGeneration(input2));
    });
  });
});
