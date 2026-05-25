import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given empty array -- no live cells remain", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("single cell with 0 neighbors dies (underpopulation) -- [(0,0)] → []", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("two adjacent cells each with 1 neighbor die (underpopulation) -- [(0,1),(1,1)] → []", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });
  it("live cell with exactly 2 neighbors survives (survival) -- cell (0,0) with 2 neighbors stays alive", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [1, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([1, 1]);
  });
  it("live cell with exactly 3 neighbors survives (survival) -- cell (1,1) with 3 neighbors stays alive", () => {
    const cells: [number, number][] = [[0, 1], [1, 0], [1, 1], [2, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });
  it("live cell with more than 3 neighbors dies (overpopulation) -- center cell (1,1) with 8 neighbors dies in 3x3 block", () => {
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 neighbors becomes alive (reproduction) -- dead cell (1,1) with neighbors [(0,0),(1,0),(0,1)] → (1,1) is in result", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });
  it("block still life remains unchanged (survival) -- [(0,0),(1,0),(0,1),(1,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(cells);
    const sorted = (arr: [number, number][]) => [...arr].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted(cells));
  });
  it("blinker oscillator transforms correctly -- [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const cells: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(cells);
    const sorted = (arr: [number, number][]) => [...arr].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("works with negative coordinates -- block at (-2,-2) stays unchanged", () => {
    const cells: [number, number][] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    const result = nextGeneration(cells);
    const sorted = (arr: [number, number][]) => [...arr].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted(cells));
  });
});
