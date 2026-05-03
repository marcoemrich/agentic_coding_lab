import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a block (still life) unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 diagonal neighbors -> dies from overpopulation
    const input: [number, number][] = [[1, 1], [0, 0], [0, 2], [2, 0], [2, 2]];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    // Dead cell (1,1) has neighbors (0,0), (1,0), (0,1) -> becomes alive
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates", () => {
    const block: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
});
