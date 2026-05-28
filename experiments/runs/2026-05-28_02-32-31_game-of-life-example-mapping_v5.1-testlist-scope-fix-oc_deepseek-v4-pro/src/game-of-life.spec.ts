import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a single live cell with 0 neighbors -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill live cells with 1 neighbor (underpopulation) -- [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should keep a 2×2 block unchanged (each cell has 2 neighbors, survival) -- [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it("should let cell with 3 neighbors survive -- cell (1,1) surrounded by 3 lives on", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(input).map(([x, y]) => `${x},${y}`).sort();
    expect(result).toEqual(expect.arrayContaining(["1,0", "1,1"]));
  });

  it("should kill cell with 4 neighbors (overpopulation) -- cell (1,1) with 4 neighbors dies", () => {
    const input: [number, number][] = [[-1, 0], [0, -1], [0, 0], [0, 1], [1, 0]];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([0, 0]);
  });

  it("should kill cell with more than 4 neighbors (overpopulation) -- cell with 5+ neighbors dies", () => {
    const cells = Array.from({ length: 9 }, (_, i) => [i % 3, Math.floor(i / 3)] as [number, number]);
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });

  it("should bring dead cell with exactly 3 neighbors to life (reproduction) -- dead (1,1) with 3 neighbors becomes alive", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([0, 1]);
  });

  it("should keep dead cell with 2 neighbors dead -- dead (1,1) with 2 neighbors stays dead", () => {
    const input: [number, number][] = [[0, 0], [1, 0]];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([0, 1]);
  });

  it("should keep dead cell with 4 neighbors dead -- dead (1,1) with 4 neighbors stays dead", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([-1, -1]);
  });

  it("should evolve blinker Gen 0 to Gen 1 -- [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.sort()).toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });

  it("should evolve blinker Gen 1 to Gen 2 -- [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [0, 2]].sort());
  });
});