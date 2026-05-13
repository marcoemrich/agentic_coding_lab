import { describe, it, expect } from "vitest";
import { advanceGenerations } from "./gameOfLife.js";

describe("Game of Life", () => {
  it("should return input unchanged when steps is 0", () => {
    const input = { aliveCells: [[5, 5]], steps: 0 };
    const result = advanceGenerations(input.aliveCells, input.steps);
    expect(result).toEqual([[5, 5]]);
  });
  it("should kill a live cell with no neighbors (underpopulation)", () => {
    const input = { aliveCells: [[0, 0]], steps: 1 };
    const result = advanceGenerations(input.aliveCells, input.steps);
    expect(result).toEqual([]);
  });
  it("should keep a live cell with 2 live neighbors", () => {
    // Configuration: three cells in a row
    // .#.
    // ###
    // .#.
    // Center cell (1,1) has exactly 2 neighbors
    const input = { aliveCells: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], steps: 1 };
    const result = advanceGenerations(input.aliveCells, input.steps);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a live cell with 3 live neighbors", () => {
    // A cell with 3 neighbors should survive
    // Create a 2x2 block + one more cell
    const input = { aliveCells: [[0, 0], [1, 0], [0, 1], [1, 1], [2, 0]], steps: 1 };
    const result = advanceGenerations(input.aliveCells, input.steps);
    expect(result).toContainEqual([0, 0]);
  });
  it("should birth a dead cell with exactly 3 live neighbors", () => {
    // Three cells in a row create a dead cell between them that should come alive
    // ###
    // .#. <- center dead cell has 3 neighbors
    const input = { aliveCells: [[0, 0], [1, 0], [2, 0], [1, 1]], steps: 1 };
    const result = advanceGenerations(input.aliveCells, input.steps);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle a still life pattern (tub) advancing one generation", () => {
    // A tub is a still life pattern that stays the same
    // .#.
    // #.#
    // .#.
    const input = { aliveCells: [[1, 0], [0, 1], [2, 1], [1, 2]], steps: 1 };
    const result = advanceGenerations(input.aliveCells, input.steps);
    expect(result).toEqual(input.aliveCells);
  });
  it("should advance multiple generations (steps > 1)", () => {
    // Tub pattern stays the same, so advancing 2 steps should still be the same
    const input = { aliveCells: [[1, 0], [0, 1], [2, 1], [1, 2]], steps: 2 };
    const result = advanceGenerations(input.aliveCells, input.steps);
    expect(result).toEqual(input.aliveCells);
  });
  it("should return output in lexicographic order (x ascending, y ascending)", () => {
    // Return cells in wrong order to test sorting
    const input = { aliveCells: [[2, 1], [1, 0], [0, 1], [1, 2]], steps: 1 };
    const result = advanceGenerations(input.aliveCells, input.steps);
    // Tub pattern returns unchanged, but should be sorted
    expect(result).toEqual([[0, 1], [1, 0], [1, 2], [2, 1]]);
  });
  it("should handle negative coordinates", () => {
    // Tub pattern shifted to negative coordinates
    const input = { aliveCells: [[-1, -1], [-2, 0], [0, 0], [-1, 1]], steps: 1 };
    const result = advanceGenerations(input.aliveCells, input.steps);
    expect(result).toEqual(input.aliveCells);
  });
});
