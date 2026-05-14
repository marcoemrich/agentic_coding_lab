import { describe, it, expect } from "vitest";
import { nextGeneration, Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty grid", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    const liveCells: Cell[] = [[0, 0]];
    const result = nextGeneration(liveCells);
    expect(result).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation)", () => {
    const liveCells: Cell[] = [[0, 0], [1, 0]];
    const result = nextGeneration(liveCells);
    expect(result).toEqual([]);
  });
  it("should keep a block pattern unchanged (still life)", () => {
    const liveCells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(liveCells);
    expect(result).toEqual(
      expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]])
    );
    expect(result).toHaveLength(4);
  });
  it("should oscillate a blinker from vertical to horizontal", () => {
    const liveCells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(liveCells);
    expect(result).toEqual(
      expect.arrayContaining([[-1, 1], [0, 1], [1, 1]])
    );
    expect(result).toHaveLength(3);
  });
  it("should handle cells with negative coordinates", () => {
    const liveCells: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const result = nextGeneration(liveCells);
    expect(result).toEqual(
      expect.arrayContaining([[-1, -1], [0, -1], [-1, 0], [0, 0]])
    );
    expect(result).toHaveLength(4);
  });
});
