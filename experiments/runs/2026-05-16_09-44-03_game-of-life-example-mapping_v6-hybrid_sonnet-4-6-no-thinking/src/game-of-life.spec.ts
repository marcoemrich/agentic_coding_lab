import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive with exactly 2 live neighbors", () => {
    // Three cells in a row: center has 2 neighbors → survives
    // End cells have 1 neighbor → die
    // Dead neighbors of center may also be considered (reproduction rule checked separately)
    const gen0: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).toContainEqual([1, 0]); // center survives
  });
  it("should keep a live cell alive with exactly 3 live neighbors", () => {
    // (1,1) has 3 neighbors: (0,0), (1,0), (2,0) → survives
    const gen0: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).toContainEqual([1, 1]);
  });
  it.todo("should bring a dead cell to life with exactly 3 live neighbors (reproduction)");
  it.todo("should kill a live cell with more than 3 live neighbors (overpopulation)");
  it.todo("should correctly compute the blinker pattern (oscillator)");
  it.todo("should correctly compute the block pattern (still life)");
});
