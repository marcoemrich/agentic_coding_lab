import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Conway's Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    const cells: Cell[] = [{ x: 0, y: 0 }];
    expect(nextGeneration(cells)).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation)", () => {
    const cells: Cell[] = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
    expect(nextGeneration(cells)).toEqual([]);
  });
  it("should keep a block of four cells unchanged (still life)", () => {
    const cells: Cell[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ];
    expect(nextGeneration(cells)).toEqual(expect.arrayContaining(cells));
    expect(nextGeneration(cells)).toHaveLength(4);
  });
  it("should rotate a vertical blinker to horizontal", () => {
    const cells: Cell[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ];
    const expected: Cell[] = [
      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ];
    expect(nextGeneration(cells)).toEqual(expect.arrayContaining(expected));
    expect(nextGeneration(cells)).toHaveLength(3);
  });
  it("should create a new live cell where a dead cell has exactly 3 live neighbors (reproduction)", () => {
    const cells: Cell[] = [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 1 },
    ];
    const expected: Cell[] = [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ];
    expect(nextGeneration(cells)).toEqual(expect.arrayContaining(expected));
    expect(nextGeneration(cells)).toHaveLength(4);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    const cells: Cell[] = [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 },
    ];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual({ x: 1, y: 1 });
  });
  it("should handle negative coordinates", () => {
    const cells: Cell[] = [
      { x: -5, y: -5 },
      { x: -5, y: -4 },
      { x: -5, y: -3 },
    ];
    const expected: Cell[] = [
      { x: -6, y: -4 },
      { x: -5, y: -4 },
      { x: -4, y: -4 },
    ];
    expect(nextGeneration(cells)).toEqual(expect.arrayContaining(expected));
    expect(nextGeneration(cells)).toHaveLength(3);
  });
});
