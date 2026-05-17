import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when input is empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should keep a block stable (2x2 still life with each cell having 3 neighbors)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const verticalBlinker: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(verticalBlinker);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]] as [number, number][]));
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lShape);
    expect(result).toEqual(expect.arrayContaining([[1, 1]] as [number, number][]));
  });
  it("should handle negative coordinates", () => {
    const blinkerAtNegative: [number, number][] = [[-5, -1], [-5, 0], [-5, 1]];
    const result = nextGeneration(blinkerAtNegative);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-6, 0], [-5, 0], [-4, 0]] as [number, number][]));
  });
});
