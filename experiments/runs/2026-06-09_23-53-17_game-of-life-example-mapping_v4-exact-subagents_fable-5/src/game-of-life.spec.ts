// game-of-life.spec.ts
import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should kill a single live cell (underpopulation: 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation: 1 neighbor each)", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("should keep a live cell with 2 live neighbors alive (survival)", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 1],
      [2, 2],
    ]);
    expect(result.sort()).toEqual([[1, 1]]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Ring pattern ###/.#./### — center cell (1,1) has 6 live neighbors
    const ring: Array<[number, number]> = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    expect(nextGeneration(ring)).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    // ##./#.. → ##./##. — (1,1) is born; all three live cells survive
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(result.sort()).toEqual(
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ].sort(),
    );
  });
  it("should keep a block still life unchanged", () => {
    const block: Array<[number, number]> = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(nextGeneration(block).sort()).toEqual([...block].sort());
  });
  it("should oscillate a vertical blinker to a horizontal blinker (negative coordinates)", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(result.sort()).toEqual(
      [
        [-1, 1],
        [0, 1],
        [1, 1],
      ].sort(),
    );
  });
});
