import { describe, it, expect } from "vitest";
import { advanceGenerations } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return alive cells unchanged when steps is 0", () => {
    const input = { aliveCells: [[5, 5]], steps: 0 };
    const result = advanceGenerations(input.aliveCells, input.steps);
    expect(result).toEqual([[5, 5]]);
  });
  it("should kill a lone cell with 0 neighbors after 1 generation", () => {
    const result = advanceGenerations([[5, 5]], 1);
    expect(result).toEqual([]);
  });
  it("should keep a cell alive when it has 2 neighbors", () => {
    // Create a configuration with a center cell and exactly 2 neighbors
    // Center at (0, 0), neighbors at (0, 1) and (1, 0)
    const result = advanceGenerations([
      [0, 0],
      [0, 1],
      [1, 0],
    ], 1);
    expect(result).toContainEqual([0, 0]);
  });
  it("should keep a cell alive when it has 3 neighbors", () => {
    // Create a configuration with a center cell and exactly 3 neighbors
    // Center at (0, 0), neighbors at (0, 1), (1, 0), (1, 1)
    const result = advanceGenerations([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ], 1);
    expect(result).toContainEqual([0, 0]);
  });
  it("should kill a cell when it has more than 3 neighbors", () => {
    // Create a configuration with a center cell surrounded by 4 neighbors (overpopulation)
    // Center at (0, 0), neighbors at (0, 1), (1, 0), (1, 1), (-1, 0)
    const result = advanceGenerations([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, 0],
    ], 1);
    expect(result).not.toContainEqual([0, 0]);
  });
  it("should create a new cell when a dead cell has exactly 3 neighbors", () => {
    // Dead cell at (0, 0) with exactly 3 living neighbors at (0, 1), (1, 0), (1, 1)
    const result = advanceGenerations([
      [0, 1],
      [1, 0],
      [1, 1],
    ], 1);
    expect(result).toContainEqual([0, 0]);
  });
  it("should preserve a still life pattern (tub) across a generation", () => {
    // A tub is a 2x3 still life pattern
    // Gen 0:        Gen 1:
    //  .#.           .#.
    //  #.#     →     #.#
    //  .#.           .#.
    const tub = [[0, 1], [1, 0], [1, 2], [2, 1]];
    const result = advanceGenerations(tub, 1);
    expect(result).toEqual(tub);
  });
  it("should advance through multiple generations correctly", () => {
    // Start with a block (stable still life)
    // A 2x2 block remains unchanged across any number of generations
    const block = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const gen2 = advanceGenerations(block, 2);
    // After 2 generations, should still be a block
    expect(gen2).toEqual(block);
  });
});
