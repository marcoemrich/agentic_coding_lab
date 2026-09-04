import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 (underpopulation): kills two adjacent cells with 1 neighbor each — [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 (survival): a live cell with 3 live neighbors survives — (1,1) of [(0,0),(1,0),(2,0),(1,1)] stays alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("Rule 3 (overpopulation): a live cell with more than 3 live neighbors dies — center (1,1) of [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] dies", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    expect(nextGeneration(gen0)).not.toContainEqual([1, 1]);
  });
  it("Rule 4 (reproduction): a dead cell with exactly 3 live neighbors becomes alive — [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    expect(sorted(nextGeneration(gen0))).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("Block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] -> same 4 cells", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("Blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sorted(nextGeneration(vertical))).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("Blinker oscillates back to vertical after two generations — [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(horizontal))).toEqual(sorted([[0, 0], [0, 1], [0, 2]]));
  });
  it("handles negative coordinates — blinker at [(-5,-5),(-5,-4),(-5,-3)] -> [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const vertical: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    expect(sorted(nextGeneration(vertical))).toEqual(sorted([[-6, -4], [-5, -4], [-4, -4]]));
  });
});
