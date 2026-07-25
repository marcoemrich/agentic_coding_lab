import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive -- [(0,1),(1,1),(0,0)] produces (1,0)", () => {
    const result = nextGeneration([[0, 1], [1, 1], [0, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 2 Survival: live cell with 2 or 3 neighbors lives on", () => {
    // Gen 0: top row (0,0),(1,0),(2,0) and center (1,1); center has 3 neighbors
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 Overpopulation: live cell with more than 3 neighbors dies", () => {
    // Gen 0: ### / .#. / ### -- center (1,1) has 4 neighbors and dies
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Block still life stays unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("Blinker oscillates -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Blinker returns to original after two generations", () => {
    const gen1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const gen2 = nextGeneration(gen1);
    expect(gen2).toHaveLength(3);
    expect(gen2).toContainEqual([0, 0]);
    expect(gen2).toContainEqual([0, 1]);
    expect(gen2).toContainEqual([0, 2]);
  });
  it("should handle negative coordinates", () => {
    // Vertical blinker centered at negative coords -> horizontal
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-6, -4]);
    expect(result).toContainEqual([-5, -4]);
    expect(result).toContainEqual([-4, -4]);
  });
});
