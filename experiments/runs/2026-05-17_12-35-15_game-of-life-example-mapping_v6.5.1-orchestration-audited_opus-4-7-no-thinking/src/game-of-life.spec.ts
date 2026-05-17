import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (underpopulation - each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a block (2x2) unchanged (still life - each cell has 3 neighbors)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should oscillate a vertical blinker to horizontal (survival + reproduction)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining<[number, number]>([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should kill the center of a fully-surrounded cell (overpopulation)", () => {
    const fullGrid: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(fullGrid);
    expect(result).not.toEqual(expect.arrayContaining<[number, number]>([[1, 1]]));
  });
  it("should birth a dead cell with exactly 3 live neighbors (reproduction)", () => {
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lShape);
    expect(result).toEqual(expect.arrayContaining<[number, number]>([[1, 1]]));
  });
  it("should handle negative coordinates correctly", () => {
    const blinker: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const result = nextGeneration(blinker);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining<[number, number]>([[-6, -4], [-5, -4], [-4, -4]]));
  });
});
