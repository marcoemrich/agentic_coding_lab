import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  const sort = (cells: Cell[]) =>
    [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  expect(sort(actual)).toEqual(sort(expected));
}

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input -- []", () => {
    expectCells(nextGeneration([]), []);
  });
  it("should kill a single isolated cell -- [(0,0)] becomes []", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
  it("should apply underpopulation rule -- [(0,1), (1,1)] becomes []", () => {
    expectCells(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
      [],
    );
  });
  it("should apply survival rule -- [(0,0), (1,0), (2,0)] becomes [(1,-1), (1,0), (1,1)]", () => {
    expectCells(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
      [
        [1, -1],
        [1, 0],
        [1, 1],
      ],
    );
  });
  it("should apply overpopulation rule -- plus shape center (1,1) dies, becomes [(0,0),(0,1),(0,2),(1,0),(1,2),(2,0),(2,1),(2,2)]", () => {
    expectCells(
      nextGeneration([
        [1, 1],
        [0, 1],
        [2, 1],
        [1, 0],
        [1, 2],
      ]),
      [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
      ],
    );
  });
  it("should apply reproduction rule -- [(0,2), (1,2), (0,1)] becomes [(0,1), (0,2), (1,1), (1,2)]", () => {
    expectCells(
      nextGeneration([
        [0, 2],
        [1, 2],
        [0, 1],
      ]),
      [
        [0, 1],
        [0, 2],
        [1, 1],
        [1, 2],
      ],
    );
  });
  it("should preserve block still life -- [(0,0), (1,0), (0,1), (1,1)] unchanged", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectCells(nextGeneration(block), block);
  });
  it("should evolve blinker horizontally -- [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]", () => {
    expectCells(
      nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
      [
        [-1, 1],
        [0, 1],
        [1, 1],
      ],
    );
  });
  it("should evolve blinker back vertically -- [(-1,1), (0,1), (1,1)] becomes [(0,0), (0,1), (0,2)]", () => {
    expectCells(
      nextGeneration([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
    );
  });
});
