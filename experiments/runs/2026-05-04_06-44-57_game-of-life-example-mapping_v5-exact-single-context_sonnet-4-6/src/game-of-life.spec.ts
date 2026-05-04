import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid when single cell dies from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty grid when two cells die from underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep live cell alive when it has exactly 2 live neighbors", () => {
    // (0,0) has 2 live neighbors: (1,0) and (0,1) → survives
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("should keep live cell alive when it has exactly 3 live neighbors", () => {
    // (0,0) has 3 live neighbors: (-1,0), (1,0), (0,-1) → survives
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0], [0, -1]])).toContainEqual([0, 0]);
  });
  it("should kill live cell when it has more than 3 live neighbors (overpopulation)", () => {
    // (1,1) has 4 live neighbors: (0,0),(1,0),(2,0),(0,1) → dies
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]])).not.toContainEqual([1, 1]);
  });
  it("should bring dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // Dead cell (1,1) has 3 live neighbors: (0,0),(1,0),(0,1) → becomes alive
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("should correctly compute blinker oscillator next generation", () => {
    const gen1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(gen1).toHaveLength(3);
    expect(gen1).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should correctly compute block still life next generation", () => {
    const gen1 = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(gen1).toHaveLength(4);
    expect(gen1).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
});
