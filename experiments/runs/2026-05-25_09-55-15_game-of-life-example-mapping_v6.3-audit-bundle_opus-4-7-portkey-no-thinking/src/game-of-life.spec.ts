import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty input returns empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die from underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: live cell with fewer than 2 neighbors dies — diagonal pair [(0,0),(1,1)] → []", () => {
    expect(nextGeneration([[0, 0], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival: live cell with 2 neighbors lives on — L-shape [(0,0),(1,0),(0,1)] becomes block [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });
  it("Rule 3 Overpopulation: center of full 3x3 dies — center (1,1) not in next generation", () => {
    const full3x3: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(full3x3);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive — triangle [(0,0),(2,0),(1,1)] births (1,0)", () => {
    const result = nextGeneration([[0, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("Block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] stays the same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("Blinker oscillator rotates — vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.sort()).toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });
  it("handles negative coordinates — blinker at [(-5,-5),(-5,-4),(-5,-3)] rotates to [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result.sort()).toEqual([[-6, -4], [-5, -4], [-4, -4]].sort());
  });
});
