import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive -- L-tromino block result", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });
  it("Rule 2 Survival: live cell with 2 or 3 neighbors lives on", () => {
    // T-shape: center (1,0) has 3 neighbors -> survives
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, -1]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,0")).toBe(true);
  });
  it("Rule 3 Overpopulation: live cell with 4 neighbors dies", () => {
    // Plus-shape: center (1,1) has 4 neighbors -> dies
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
  it("Blinker oscillator: [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });
  it("Blinker oscillator returns to original after two generations", () => {
    const gen0: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(gen0));
    expect(new Set(gen2.map((c) => c.join(",")))).toEqual(
      new Set(gen0.map((c) => c.join(","))),
    );
  });
});
