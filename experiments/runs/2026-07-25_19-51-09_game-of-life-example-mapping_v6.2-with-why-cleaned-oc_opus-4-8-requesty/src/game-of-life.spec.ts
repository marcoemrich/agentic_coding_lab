import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive -- L-tromino [(0,0),(1,0),(0,1)] -> block", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });
  it("Rule 2 Survival: cell with 2 or 3 neighbors lives on -- T shape center survives", () => {
    // Center (1,1) with exactly 3 live neighbors (top row) survives.
    const result = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(true);
  });
  it("Rule 3 Overpopulation: cell with more than 3 neighbors dies -- center of plus+corners dies", () => {
    // Alive center (1,1) with 4 live orthogonal neighbors dies by overpopulation.
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("Block still life stays unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });
  it("Blinker oscillates -- vertical [(0,0),(0,1),(0,2)] -> horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map((c) => c.join(","))),
    );
  });
  it("Blinker oscillates back -- horizontal -> vertical after 2 generations", () => {
    const gen1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const gen2 = nextGeneration(gen1);
    expect(new Set(gen2.map((c) => c.join(",")))).toEqual(
      new Set([[0, 0], [0, 1], [0, 2]].map((c) => c.join(","))),
    );
  });
});
