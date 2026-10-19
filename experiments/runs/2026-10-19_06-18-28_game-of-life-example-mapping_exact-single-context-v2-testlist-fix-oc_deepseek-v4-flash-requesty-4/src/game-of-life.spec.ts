import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const cellKey = (c: Cell) => `${c[0]},${c[1]}`;

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for a single live cell (underpopulation) -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty grid for two adjacent cells (each has 1 neighbor) -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell with 3 neighbors alive ((1,1) survives) -- center remains live", () => {
    expect(nextGeneration([[0, 1], [1, 0], [1, 1], [2, 1]])).toContainEqual([1, 1]);
  });
  it("should keep a live cell with 2 neighbors alive (survival)", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toContainEqual([1, 1]);
  });
  it("should kill a live cell with 4 neighbors (overpopulation) -- center (1,1) dies", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    expect(nextGeneration(input)).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 neighbors alive (reproduction) -- (1,1) becomes live", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("should transform a blinker oscillator from Gen 0 to Gen 1 -- [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.map(cellKey).sort()).toEqual(["-1,1", "0,1", "1,1"]);
  });
  it("should keep a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result.map(cellKey).sort()).toEqual(["0,0", "0,1", "1,0", "1,1"]);
  });
});