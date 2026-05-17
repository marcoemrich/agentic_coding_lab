import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation: 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation: 1 neighbor each)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should preserve a 2x2 block (still life: each cell has 3 neighbors)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should toggle a vertical blinker to horizontal (survival + reproduction)", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(horizontal));
  });
  it("should kill the center of a full 3x3 square (overpopulation: 8 neighbors)", () => {
    const square: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(square);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should handle negative coordinates", () => {
    const verticalBlinker: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const horizontalBlinker: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(verticalBlinker);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(horizontalBlinker));
  });
});
