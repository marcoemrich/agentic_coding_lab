import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single lonely cell — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - Underpopulation: two adjacent cells each with 1 neighbor die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 - Survival: a live cell with 3 neighbors lives on — (1,1) survives", () => {
    // Gen 0: ### / .#. / ... — (1,1) is alive with 3 neighbors (0,0),(1,0),(2,0)
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 - Overpopulation: center cell with 4 neighbors dies", () => {
    // Gen 0: ### / .#. / ### — (1,1) has 4 live neighbours
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 - Reproduction: dead cell with exactly 3 neighbors becomes alive — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map(String))).toEqual(
      new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map(String)),
    );
  });
  it("Block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(block).map(String))).toEqual(
      new Set(block.map(String)),
    );
  });
  it("Blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map(String))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map(String)),
    );
  });
  it("Blinker oscillates back to vertical in generation 2 — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(new Set(result.map(String))).toEqual(
      new Set([[0, 0], [0, 1], [0, 2]].map(String)),
    );
  });
  it("handles negative coordinates — blinker at negative offsets oscillates correctly", () => {
    const result = nextGeneration([[-5, -10], [-5, -9], [-5, -8]]);
    expect(new Set(result.map(String))).toEqual(
      new Set([[-6, -9], [-5, -9], [-4, -9]].map(String)),
    );
  });
});
