import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]) =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty grid", () => {
    const livingCells: Cell[] = [];
    const result = nextGeneration(livingCells);
    expect(result).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    const livingCells: Cell[] = [[0, 0]];
    const result = nextGeneration(livingCells);
    expect(result).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    const livingCells: Cell[] = [[0, 0], [0, 1]];
    const result = nextGeneration(livingCells);
    expect(result).toEqual([]);
  });
  it("should keep a cell alive that has exactly 2 neighbors (survival)", () => {
    const livingCells: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(livingCells);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep a cell alive that has exactly 3 neighbors (survival)", () => {
    const livingCells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(livingCells);
    expect(result).toContainEqual([0, 0]);
  });
  it("should kill a cell that has 4 neighbors (overpopulation)", () => {
    const livingCells: Cell[] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    const result = nextGeneration(livingCells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 neighbors (reproduction)", () => {
    const livingCells: Cell[] = [[0, 1], [1, 1], [0, 0]];
    const result = nextGeneration(livingCells);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep a block pattern unchanged (still life)", () => {
    const livingCells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(livingCells);
    expect(sortCells(result)).toEqual(sortCells(livingCells));
  });
  it("should oscillate a blinker pattern (horizontal to vertical)", () => {
    const livingCells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(livingCells);
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(result)).toEqual(sortCells(expected));
  });
});
