import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

function expectCells(actual: [number, number][], expected: [number, number][]) {
  expect(actual).toHaveLength(expected.length);
  for (const cell of expected) {
    expect(actual).toContainEqual(cell);
  }
}

describe("Game of Life", () => {
  it("should return empty array for empty input -- [] becomes []", () => {
    expectCells(nextGeneration([]), []);
  });
  it("should kill single isolated cell -- [(0,0)] becomes []", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
  it("should kill cells with fewer than 2 neighbors (underpopulation) -- [(0,1), (1,1)] becomes []", () => {
    expectCells(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
      [],
    );
  });
  it("should keep live cell with 2 or 3 neighbors (survival) -- center cell (1,1) with 3 neighbors survives", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill live cell with more than 3 neighbors (overpopulation) -- plus shape center (1,1) dies, corners survive", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([2, 0]);
    expect(result).toContainEqual([0, 2]);
    expect(result).toContainEqual([2, 2]);
  });
  it("should birth dead cell with exactly 3 neighbors (reproduction) -- [(0,0), (1,0), (0,1)] becomes [(0,0), (1,0), (0,1), (1,1)]", () => {
    expectCells(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    );
  });
  it("should leave block unchanged (still life) -- [(0,0), (1,0), (0,1), (1,1)] stays the same", () => {
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectCells(nextGeneration(block), block);
  });
  it("should advance blinker horizontally -- [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]", () => {
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
  it("should advance blinker back to vertical -- [(-1,1), (0,1), (1,1)] becomes [(0,0), (0,1), (0,2)]", () => {
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
