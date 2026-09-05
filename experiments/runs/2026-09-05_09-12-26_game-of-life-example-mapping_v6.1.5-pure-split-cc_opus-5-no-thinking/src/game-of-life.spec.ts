import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 – underpopulation: two adjacent cells each with 1 neighbor die — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 – survival: live center cell with 3 live neighbors lives on — [(0,0), (1,0), (2,0), (1,1)] keeps (1,1) alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(new Set(result.map(String))).toEqual(
      new Set([[0, 0], [1, 0], [2, 0], [1, 1], [0, 1], [2, 1], [1, -1]].map(String)),
    );
  });
  it("Rule 3 – overpopulation: live center cell with 4+ live neighbors dies — [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] drops (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(new Set(result.map(String))).toEqual(
      new Set([[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, -1], [1, 3]].map(String)),
    );
  });
  it("Rule 4 – reproduction: dead cell with exactly 3 live neighbors becomes alive — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map(String))).toEqual(
      new Set([[0, 0], [1, 0], [0, 1], [1, 1]].map(String)),
    );
  });
  it("Block still life stays unchanged — [(0,0), (1,0), (0,1), (1,1)] → same 4 cells", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(block).map(String))).toEqual(
      new Set(block.map(String)),
    );
  });
  it("Blinker oscillates from vertical to horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map(String))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map(String)),
    );
  });
  it("Blinker oscillates back from horizontal to vertical — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(new Set(result.map(String))).toEqual(
      new Set([[0, 0], [0, 1], [0, 2]].map(String)),
    );
  });
  it("handles negative coordinates — blinker at [(-5,-5), (-5,-4), (-5,-3)] → [(-6,-4), (-5,-4), (-4,-4)]", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(new Set(result.map(String))).toEqual(
      new Set([[-6, -4], [-5, -4], [-4, -4]].map(String)),
    );
  });
});
