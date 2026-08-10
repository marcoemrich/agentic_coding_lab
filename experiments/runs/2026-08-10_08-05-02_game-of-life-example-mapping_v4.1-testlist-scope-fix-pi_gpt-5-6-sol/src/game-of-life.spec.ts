import { describe, it, expect } from "vitest";
import { advanceGenerations, nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should kill a single cell with 0 live neighbors — [(0,0)] becomes []", () => {
    const cells: Cell[] = [[0, 0]];

    expect(nextGeneration(cells)).toEqual([]);
  });
  it("should kill two adjacent cells with 1 live neighbor each — [(0,1),(1,1)] becomes []", () => {
    const cells: Cell[] = [[0, 1], [1, 1]];

    expect(nextGeneration(cells)).toEqual([]);
  });
  it("should preserve a live center cell with exactly 2 live neighbors — (1,1) remains alive", () => {
    const cells: Cell[] = [[0, 1], [1, 1], [2, 1]];

    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });
  it("should preserve a live center cell with exactly 3 live neighbors — (1,1) remains alive", () => {
    const cells: Cell[] = [[0, 1], [1, 1], [2, 1], [1, 0]];

    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });
  it("should kill an overpopulated center cell with 4 live neighbors — (1,1) is absent from the next generation", () => {
    const cells: Cell[] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];

    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("should reproduce a dead cell with exactly 3 live neighbors — [(0,0),(1,0),(0,1)] becomes [(0,0),(1,0),(0,1),(1,1)]", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];

    expect(nextGeneration(cells)).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should leave the 2×2 block still life unchanged — [(0,0),(1,0),(0,1),(1,1)] remains the same 4 cells", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(nextGeneration(cells)).toEqual(cells);
  });
  it("should handle negative input coordinates on the infinite grid — [(-2,-2),(-1,-2),(-2,-1),(-1,-1)] remains the same 4 cells", () => {
    const cells: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];

    expect(nextGeneration(cells)).toEqual(cells);
  });
  it("should advance a vertical blinker by one generation — [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)] including negative x=-1", () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];

    expect(nextGeneration(cells)).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should oscillate a blinker back after two generations — [(0,0),(0,1),(0,2)] becomes [(0,0),(0,1),(0,2)] after Gen 2", () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];

    expect(advanceGenerations(cells, 2)).toEqual(cells);
  });
});
