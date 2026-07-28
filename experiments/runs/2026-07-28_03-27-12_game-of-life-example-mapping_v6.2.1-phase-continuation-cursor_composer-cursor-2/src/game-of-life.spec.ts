import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated live cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with fewer than 2 neighbors (underpopulation) -- [(0,1), (1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should birth a dead cell with exactly 3 live neighbors (reproduction) -- [(0,0), (1,0), (0,1)] becomes [(0,0), (1,0), (0,1), (1,1)]", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(input)).toEqual(expected);
  });
  it("should keep live cells with 2 or 3 neighbors alive (survival) -- [(1,0), (0,1), (2,1)] becomes [(1,0), (1,1)]", () => {
    const input: [number, number][] = [[1, 0], [0, 1], [2, 1]];
    const expected: [number, number][] = [[1, 0], [1, 1]];
    expect(nextGeneration(input)).toEqual(expected);
  });
  it("should kill live cells with more than 3 neighbors (overpopulation) -- [(0,0), (1,0), (2,0), (1,1), (0,2), (1,2), (2,2)] becomes [(0,0), (2,0), (0,1), (2,1), (0,2), (2,2), (1,0), (1,2)]", () => {
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ];
    const expected: [number, number][] = [
      [0, 0], [0, 2], [1, -1], [1, 0], [1, 2], [1, 3], [2, 0], [2, 2],
    ];
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
    expect(nextGeneration(input).some(([x, y]) => x === 1 && y === 1)).toBe(
      false,
    );
  });
  it("should leave a 2x2 block unchanged (still life) -- [(0,0), (1,0), (0,1), (1,1)] stays the same", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(input)).toEqual(input);
  });
  it("should oscillate a vertical blinker to horizontal -- [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]", () => {
    const input: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });
});
