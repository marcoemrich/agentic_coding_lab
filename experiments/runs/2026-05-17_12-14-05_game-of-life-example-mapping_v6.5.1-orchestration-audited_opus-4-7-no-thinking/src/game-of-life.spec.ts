import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells, each with only 1 neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a block (still life) unchanged", () => {
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should transform a vertical blinker into a horizontal blinker (survival + reproduction)", () => {
    const vertical: [number, number][] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const horizontal: [number, number][] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
  it("should kill an overpopulated cell with more than 3 neighbors", () => {
    // Center (1,1) plus 4 diagonal neighbors = 4 neighbors → dies (overpopulation)
    const cells: [number, number][] = [
      [1, 1],
      [0, 0],
      [2, 0],
      [0, 2],
      [2, 2],
    ];
    const result = nextGeneration(cells);
    expect(result.find(([x, y]) => x === 1 && y === 1)).toBeUndefined();
  });
  it("should handle negative coordinates", () => {
    // Vertical blinker centered on (-5, 0)
    const vertical: [number, number][] = [
      [-5, -1],
      [-5, 0],
      [-5, 1],
    ];
    const horizontal: [number, number][] = [
      [-6, 0],
      [-5, 0],
      [-4, 0],
    ];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
});
