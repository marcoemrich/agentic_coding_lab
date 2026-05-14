import { describe, it, expect } from "vitest";
import { nextGeneration, Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells with only one neighbor each (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep block pattern unchanged (survival with 2-3 neighbors)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sort = (cells: Cell[]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(result)).toEqual(sort(block));
  });
  it("should transform blinker from horizontal to vertical (reproduction and underpopulation combined)", () => {
    const blinkerVertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinkerVertical);
    const sort = (cells: Cell[]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(result)).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should kill center cell surrounded by more than 3 neighbors (overpopulation)", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    const result = nextGeneration(gen0);
    const sort = (cells: Cell[]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(result)).toEqual([[0, 0], [0, 2], [1, -1], [1, 0], [1, 2], [1, 3], [2, 0], [2, 2]]);
  });
});
