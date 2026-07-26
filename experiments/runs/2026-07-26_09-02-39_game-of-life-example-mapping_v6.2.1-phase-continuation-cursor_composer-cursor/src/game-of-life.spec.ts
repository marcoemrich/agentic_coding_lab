import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

function expectCells(actual: [number, number][], expected: [number, number][]): void {
  expect(actual.sort((a, b) => a[0] - b[0] || a[1] - b[1])).toEqual(
    expected.sort((a, b) => a[0] - b[0] || a[1] - b[1]),
  );
}

describe("Game of Life", () => {
  it("should return empty array for empty input -- []", () => {
    expectCells(nextGeneration([]), []);
  });
  it("should kill single live cell with no neighbors (underpopulation) -- [(0,0)] becomes []", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
  it("should kill live cells with fewer than 2 neighbors (underpopulation) -- [(0,1), (1,1)] becomes []", () => {
    expectCells(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
      [],
    );
  });
  it("should keep live cell with 2 or 3 neighbors (survival) -- center (1,0) survives in horizontal bar", () => {
    const gen0: [number, number][] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    expectCells(nextGeneration(gen0), [
      [1, -1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("should kill live cell with more than 3 neighbors (overpopulation) -- center (1,1) dies in plus pattern", () => {
    const gen0: [number, number][] = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 1],
    ];
    expectCells(nextGeneration(gen0), [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ]);
    expect(nextGeneration(gen0).some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("should birth dead cell with exactly 3 live neighbors (reproduction) -- (1,1) becomes alive", () => {
    const gen0: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    expectCells(nextGeneration(gen0), [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });
  it("should leave block pattern unchanged (still life) -- [(0,0), (1,0), (0,1), (1,1)] unchanged", () => {
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectCells(nextGeneration(block), block);
  });
  it("should oscillate blinker horizontally (gen 0 to gen 1) -- [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]", () => {
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
  it("should oscillate blinker back vertically (gen 1 to gen 2) -- [(-1,1), (0,1), (1,1)] becomes [(0,0), (0,1), (0,2)]", () => {
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
