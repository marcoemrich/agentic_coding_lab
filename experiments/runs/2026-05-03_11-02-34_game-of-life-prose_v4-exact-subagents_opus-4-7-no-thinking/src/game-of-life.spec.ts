import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life", () => {
  it("should return an empty set when there are no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single living cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill a living cell with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep alive a living cell with two live neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 1], [2, 2]])).toEqual([[1, 1]]);
  });
  it("should keep alive a living cell with three live neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]).sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });
  it("should kill a living cell with four live neighbors (overpopulation)", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it("should bring a dead cell with exactly three live neighbors to life (reproduction)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]]).sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });
  it("should handle living cells with negative coordinates", () => {
    expect(nextGeneration([[-5, -5], [-4, -5], [-5, -4], [-4, -4]]).sort()).toEqual([[-5, -5], [-4, -5], [-5, -4], [-4, -4]].sort());
  });
  it("should produce the correct next generation for a blinker pattern (oscillator)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]]).sort()).toEqual([[1, -1], [1, 0], [1, 1]].sort());
  });
});
