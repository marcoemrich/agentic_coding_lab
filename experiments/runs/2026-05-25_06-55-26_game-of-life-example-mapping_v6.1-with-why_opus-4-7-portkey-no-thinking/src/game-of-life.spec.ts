import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die from underpopulation — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const sort = (cells: Cell[]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(nextGeneration(block))).toEqual(sort(block));
  });
  it("live cell with 2 neighbors survives — row of 3 [(0,0),(1,0),(2,0)], center (1,0) survives", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("live cell with 4 neighbors dies from overpopulation — center of plus dies", () => {
    const cells: Cell[] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 neighbors becomes alive — (1,1) born from [(0,0),(1,0),(0,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("blinker oscillates: vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const sort = (cells: Cell[]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sort(next)).toEqual(sort([[-1, 1], [0, 1], [1, 1]]));
  });
  it("handles negative coordinates correctly — block at negative origin stays stable", () => {
    const sort = (cells: Cell[]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(sort(nextGeneration(block))).toEqual(sort(block));
  });
});
