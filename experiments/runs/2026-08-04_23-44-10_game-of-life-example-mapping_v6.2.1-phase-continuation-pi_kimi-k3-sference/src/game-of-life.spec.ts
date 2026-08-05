import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty when grid is empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation, 0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation, 1 neighbor each) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should let a live cell with 2 live neighbors survive -- corner of L survives", () => {
    // L-tromino: (0,0) has neighbors (1,0) and (0,1) -> survives; (1,1) is born
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("should let the center cell with 3 live neighbors survive (spec Rule 2 example) -- center of [(0,0),(1,0),(2,0),(1,1)] survives", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("should kill a live cell with 4 live neighbors (overpopulation, spec Rule 3 example) -- center (1,1) with 8 neighbors dies", () => {
    const ring: [number, number][] = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
    const next = nextGeneration([...ring, [1, 1]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("should revive a dead cell with exactly 3 live neighbors (reproduction, spec Rule 4 example) -- [(0,0),(1,0),(0,1)] gains (1,1), all 4 survive -> block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(next).toHaveLength(4);
    expect(next).toContainEqual([1, 1]);
    expect(next).toContainEqual([0, 0]);
    expect(next).toContainEqual([1, 0]);
    expect(next).toContainEqual([0, 1]);
  });
  it("should leave a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(next).toHaveLength(4);
    for (const cell of block) expect(next).toContainEqual(cell);
  });
  it("should oscillate a blinker from vertical to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toHaveLength(3);
    expect(next).toContainEqual([-1, 1]);
    expect(next).toContainEqual([0, 1]);
    expect(next).toContainEqual([1, 1]);
  });
  it("should oscillate a blinker from horizontal back to vertical -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(next).toHaveLength(3);
    expect(next).toContainEqual([0, 0]);
    expect(next).toContainEqual([0, 1]);
    expect(next).toContainEqual([0, 2]);
  });
  it("should handle negative coordinates -- blinker at negative coords works", () => {
    const next = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(next).toHaveLength(3);
    expect(next).toContainEqual([-6, -4]);
    expect(next).toContainEqual([-5, -4]);
    expect(next).toContainEqual([-4, -4]);
  });
});
