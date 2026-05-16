import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single living cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent living cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("keeps a 2x2 block stable (each cell has 3 neighbors)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("transforms a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("kills a live cell with 4 or more neighbors (overpopulation)", () => {
    // Center cell (1,1) surrounded by 8 live neighbors -> dies
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("brings a dead cell to life when it has exactly 3 neighbors (reproduction)", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors -> becomes alive
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("handles negative coordinates correctly", () => {
    // Vertical blinker centered at (-5, 0)
    const vertical: [number, number][] = [[-5, -1], [-5, 0], [-5, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([[-6, 0], [-5, 0], [-4, 0]])
    );
  });
});
