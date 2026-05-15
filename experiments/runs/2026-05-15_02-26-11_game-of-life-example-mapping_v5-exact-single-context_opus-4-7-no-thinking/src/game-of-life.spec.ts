import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a 2x2 block remains stable (survival)", () => {
    const cells: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(cells);
    expect(result.sort()).toEqual(cells.sort());
  });
  it("a vertical blinker becomes a horizontal blinker", () => {
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
    expect(result.slice().sort()).toEqual(horizontal.slice().sort());
  });
  it("a dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1). Dead cell (1,1) has 3 live neighbors.
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });
  it("a live cell with 4 live neighbors dies (overpopulation)", () => {
    // Center cell (1,1) plus 4 diagonal neighbors → center has 4 live neighbors
    const result = nextGeneration([
      [0, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("handles negative coordinates", () => {
    // A 2x2 block at negative coordinates is stable
    const block: [number, number][] = [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
    ];
    const result = nextGeneration(block);
    expect(result.slice().sort()).toEqual(block.slice().sort());
  });
});
