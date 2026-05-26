import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1: two adjacent live cells both die (each has 1 neighbor) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4: dead cell with exactly 3 live neighbors becomes alive -- L-shape becomes square", () => {
    // Gen 0: (0,0),(1,0),(0,1) → Gen 1 should include (1,1) since (1,1) has 3 neighbors
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const sorted = result.map((c) => c.join(",")).sort();
    expect(sorted).toEqual(["0,0", "0,1", "1,0", "1,1"]);
  });
  it("Rule 2: live cell with 2 or 3 neighbors survives -- L-shape center survives", () => {
    // Live cells: (0,0),(1,0),(0,1),(1,1) is block. Use L: (0,0),(1,0),(1,1).
    // (1,0) has 2 neighbors → survives. Verify it's in result.
    const result = nextGeneration([[0, 0], [1, 0], [1, 1]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,0")).toBe(true);
  });
  it("Rule 3: live cell with more than 3 neighbors dies (overpopulation) -- center of filled 3x3 dies", () => {
    // Gen 0: ###/.#./### → 7 cells. Center (1,1) has 6 neighbors → dies.
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("Block still life remains unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(cells);
    expect(result.sort()).toEqual(cells.sort());
  });
  it("Blinker oscillates -- vertical [(0,0),(0,1),(0,2)] -> horizontal [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    const sorted = result.map((c) => c.join(",")).sort();
    expect(sorted).toEqual(["-1,1", "0,1", "1,1"]);
  });
  it("Blinker oscillates back -- horizontal [(-1,1),(0,1),(1,1)] -> vertical [(0,0),(0,1),(0,2)]", () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(horizontal);
    const sorted = result.map((c) => c.join(",")).sort();
    expect(sorted).toEqual(["0,0", "0,1", "0,2"]);
  });
  it("Handles negative coordinates -- block at negative coordinates remains unchanged", () => {
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(block);
    const sorted = result.map((c) => c.join(",")).sort();
    expect(sorted).toEqual(["-4,-4", "-4,-5", "-5,-4", "-5,-5"]);
  });
});
