import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("returns an empty array for an empty input (no cells)", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it(
    "single live cell dies (0 neighbors, underpopulation) -- [(0,0)] -> []",
    () => {
      expect(nextGeneration([[0, 0]])).toEqual([]);
    }
  );

  // Rule 1: Underpopulation
  it(
    "Rule 1 -- Underpopulation: live cell with 1 neighbor dies -- [(0,1),(1,1)] -> []",
    () => {
      expect(
        nextGeneration([
          [0, 1],
          [1, 1],
        ])
      ).toEqual([]);
    }
  );

  // Rule 4: Reproduction
  it(
    "Rule 4 -- Reproduction: dead cell with exactly 3 live neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> includes (1,1) becoming alive, gen1 = [(0,0),(1,0),(1,1),(0,1)]",
    () => {
      const result = nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]);
      expect(result).toHaveLength(4);
      expect(result).toEqual(
        expect.arrayContaining([
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ])
      );
    }
  );

  // Rule 2: Survival
  it(
    "Rule 2 -- Survival: center cell (1,1) with 3 live neighbors survives -- [(1,1),(0,0),(2,0),(0,2)] gen1 includes (1,1)",
    () => {
      const result = nextGeneration([
        [1, 1],
        [0, 0],
        [2, 0],
        [0, 2],
      ]);
      expect(result).toEqual(
        expect.arrayContaining([[1, 1]])
      );
    }
  );

  // Rule 3: Overpopulation
  it(
    "Rule 3 -- Overpopulation: center cell (1,1) with 4 live neighbors dies -- [(1,1),(1,0),(1,2),(0,1),(2,1)] gen1 excludes (1,1)",
    () => {
      const result = nextGeneration([
        [1, 1],
        [1, 0],
        [1, 2],
        [0, 1],
        [2, 1],
      ]);
      expect(result).not.toEqual(
        expect.arrayContaining([[1, 1]])
      );
    }
  );

  // Pattern examples (combine multiple rules)
  it(
    "Block (still life) remains unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> [(0,0),(1,0),(0,1),(1,1)]",
    () => {
      const input: [number, number][] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      const result = nextGeneration(input);
      expect(result).toHaveLength(4);
      expect(result).toEqual(expect.arrayContaining(input));
    }
  );
  it("Blinker gen0->gen1 -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        [-1, 1],
        [0, 1],
        [1, 1],
      ])
    );
  });
  it(
    "Blinker gen1->gen2 returns to original vertical shape -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]",
    () => {
      const result = nextGeneration([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]);
      expect(result).toHaveLength(3);
      expect(result).toEqual(
        expect.arrayContaining([
          [0, 0],
          [0, 1],
          [0, 2],
        ])
      );
    }
  );

  // Infinite grid / negative coordinates
  it(
    "handles negative coordinates correctly -- a block shifted to negative quadrant remains unchanged",
    () => {
      const input: [number, number][] = [
        [-5, -5],
        [-4, -5],
        [-5, -4],
        [-4, -4],
      ];
      const result = nextGeneration(input);
      expect(result).toHaveLength(4);
      expect(result).toEqual(expect.arrayContaining(input));
    }
  );
});
