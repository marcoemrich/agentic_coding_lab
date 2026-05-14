import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty array for single live cell (dies of underpopulation)", () => {
    const singleCell: Cell[] = [{ x: 0, y: 0 }];
    expect(nextGeneration(singleCell)).toEqual([]);
  });
  it("should return empty array when all cells die of underpopulation", () => {
    const twoCells: Cell[] = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
    expect(nextGeneration(twoCells)).toEqual([]);
  });
  it("should keep cells alive when they have exactly 2 live neighbors (survival)", () => {
    const cells: Cell[] = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
    const result = nextGeneration(cells);
    expect(result).toContainEqual({ x: 1, y: 0 });
  });
  it("should keep cells alive when they have exactly 3 live neighbors (survival)", () => {
    const cells: Cell[] = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }];
    const result = nextGeneration(cells);
    expect(result).toContainEqual({ x: 1, y: 0 });
  });
  it("should kill live cell with more than 3 live neighbors (overpopulation)", () => {
    // Center cell at (1,1) surrounded by 4 live neighbors
    const cells: Cell[] = [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 },
    ];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual({ x: 1, y: 1 });
  });
  it("should bring dead cell to life with exactly 3 live neighbors (reproduction)", () => {
    // Dead cell at (1,1) has exactly 3 live neighbors: (0,0), (1,0), (2,0)
    const cells: Cell[] = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
    const result = nextGeneration(cells);
    expect(result).toContainEqual({ x: 1, y: 1 });
  });
  it("should keep block (2x2) pattern unchanged as a still life", () => {
    // Block pattern: four cells forming a 2x2 square
    const block: Cell[] = [
      { x: 0, y: 0 }, { x: 1, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 },
    ];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual({ x: 0, y: 0 });
    expect(result).toContainEqual({ x: 1, y: 0 });
    expect(result).toContainEqual({ x: 0, y: 1 });
    expect(result).toContainEqual({ x: 1, y: 1 });
  });
  it("should evolve blinker from vertical to horizontal in one generation", () => {
    // Vertical blinker: three cells in a column
    const verticalBlinker: Cell[] = [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ];
    // Should evolve to horizontal blinker: three cells in a row
    const result = nextGeneration(verticalBlinker);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual({ x: 0, y: 1 });
    expect(result).toContainEqual({ x: 1, y: 1 });
    expect(result).toContainEqual({ x: 2, y: 1 });
  });
});
