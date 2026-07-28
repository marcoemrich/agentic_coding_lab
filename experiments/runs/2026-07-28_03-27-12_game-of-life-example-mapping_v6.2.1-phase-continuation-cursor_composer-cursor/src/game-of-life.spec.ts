import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("Game of Life", () => {
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated live cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should apply underpopulation rule -- [(0,1), (1,1)] becomes []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("should apply survival rule -- [(0,0), (1,0), (2,0)] becomes [(1,-1), (1,0), (1,1)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
    ).toEqual([
      [1, -1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("should apply overpopulation rule -- plus shape center (1,1) dies, becomes [(0,0), (0,1), (1,0), (2,0), (2,1), (0,2), (1,2), (2,2)]", () => {
    expect(
      nextGeneration([
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
      ]),
    ).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [2, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
  });
  it("should apply reproduction rule -- [(0,2), (1,2), (0,1)] becomes [(0,2), (1,2), (0,1), (1,1)]", () => {
    expectCells(
      nextGeneration([
        [0, 2],
        [1, 2],
        [0, 1],
      ]),
      [
        [0, 2],
        [1, 2],
        [0, 1],
        [1, 1],
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
  it("should oscillate blinker -- [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]", () => {
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
});
