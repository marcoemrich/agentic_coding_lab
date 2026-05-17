import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a block (still life) unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a blinker from vertical to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
  it("should bring a dead cell to life with exactly 3 live neighbors (reproduction)", () => {
    // L-shape: three live cells, dead cell (1,1) has 3 live neighbors
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Center (1,1) has 4 live neighbors: corners (0,0),(2,0),(0,2),(2,2)
    const input: [number, number][] = [[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should handle negative coordinates", () => {
    // Vertical blinker at negative coords -> horizontal at negative coords
    const vertical: [number, number][] = [[-5, -1], [-5, 0], [-5, 1]];
    const horizontal: [number, number][] = [[-6, 0], [-5, 0], [-4, 0]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
});
