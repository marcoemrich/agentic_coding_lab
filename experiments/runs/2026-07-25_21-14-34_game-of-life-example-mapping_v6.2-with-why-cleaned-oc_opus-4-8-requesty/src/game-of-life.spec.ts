import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two live cells with 1 neighbor each die -- [(0,1),(1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ])
    ).toEqual([]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ].map((c) => c.join(",")))
    );
  });
  it("Rule 2 Survival: live cell with 2 or 3 neighbors lives on", () => {
    const result = nextGeneration([
      [0, 1],
      [1, 1],
      [2, 1],
    ]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(true);
  });
  it("Rule 3 Overpopulation: live cell with more than 3 neighbors dies", () => {
    const result = nextGeneration([
      [1, 1],
      [0, 1],
      [2, 1],
      [1, 0],
      [1, 2],
    ]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("Block still life stays unchanged -- [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(",")))
    );
  });
  it("Blinker oscillates -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set([
        [-1, 1],
        [0, 1],
        [1, 1],
      ].map((c) => c.join(",")))
    );
  });
});
