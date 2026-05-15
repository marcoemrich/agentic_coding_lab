import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) stable across generations (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should kill an overpopulated cell with more than 3 live neighbors", () => {
    // Center cell (1,1) has 4 live neighbors at (0,0),(0,1),(0,2),(2,1)
    const cells: [number, number][] = [[1, 1], [0, 0], [0, 1], [0, 2], [2, 1]];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors at (0,0),(1,0),(0,1)
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
  it("should handle negative coordinates correctly", () => {
    // Block at negative coordinates - still life
    const negativeBlock: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(negativeBlock);
    expect(result.sort()).toEqual(negativeBlock.sort());
  });
});
