import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

describe("Game of Life - Next Generation", () => {
  it("should return an empty array for an empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill both cells under underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should let a cell with 2 or 3 neighbors survive (survival)", () => {
    // Blinker bar: live center (0,1) has 2 live neighbors → survives
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toContainEqual([0, 1]);
  });
  it("should kill a cell with more than 3 neighbors (overpopulation)", () => {
    // Rule 3 example: center (1,1) has 4 live neighbors (> 3) → dies
    const next = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    // Rule 4 example: dead cell (1,1) has exactly 3 live neighbors → becomes alive
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("should keep a block still life unchanged — [(0,0),(1,0),(0,1),(1,1)]", () => {
    const byCoord = (a: Cell, b: Cell) => a[0] - b[0] || a[1] - b[1];
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect([...next].sort(byCoord)).toEqual([...block].sort(byCoord));
  });
  it("should oscillate a blinker — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const byCoord = (a: Cell, b: Cell) => a[0] - b[0] || a[1] - b[1];
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect([...next].sort(byCoord)).toEqual([...expected].sort(byCoord));
  });
  it("should handle negative coordinates", () => {
    const byCoord = (a: Cell, b: Cell) => a[0] - b[0] || a[1] - b[1];
    // Blinker entirely in negative space: vertical bar → horizontal bar
    const next = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    expect([...next].sort(byCoord)).toEqual([...expected].sort(byCoord));
  });
});
