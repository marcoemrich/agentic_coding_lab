import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns an empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell (0,0) dies from underpopulation — []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells [(0,1),(1,1)] both die from underpopulation — []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with 2 neighbors survives (Rule 2 survival)", () => {
    // (1,1) has live neighbors (0,0) and (1,0) → 2 neighbors → survives
    const result = nextGeneration([[0, 0], [1, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("a live cell with 3 neighbors survives (Rule 2 survival)", () => {
    // (1,1) has live neighbors (0,0),(1,0),(2,0) → 3 neighbors → survives
    const result = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("a live cell with more than 3 neighbors dies from overpopulation (Rule 3)", () => {
    // (1,1) has 4 live neighbors (0,0),(2,0),(0,2),(2,2) → dies
    const result = nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("a dead cell with exactly 3 neighbors becomes alive (Rule 4 reproduction)", () => {
    // dead cell (1,1) has live neighbors (0,0),(1,0),(0,1) → 3 → becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("a block still life [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sort = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(result)).toEqual(sort(block));
  });
  it("a blinker [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    const blinker: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinker);
    const sort = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(result)).toEqual(sort([[-1, 1], [0, 1], [1, 1]]));
  });
});
