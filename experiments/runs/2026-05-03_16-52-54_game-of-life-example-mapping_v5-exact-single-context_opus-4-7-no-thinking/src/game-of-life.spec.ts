import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should keep a block (still life) unchanged", () => {
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with only one neighbor (underpopulation)", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("should oscillate a vertical blinker into a horizontal blinker (survival + reproduction)", () => {
    const vertical: [number, number][] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const result = nextGeneration(vertical);
    const expected: [number, number][] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(expected.map((c) => c.join(","))),
    );
  });
  it("should kill an overpopulated cell with more than 3 neighbors", () => {
    // Center cell (1,1) has 4 live neighbors and should die
    // Input: 3x3 grid with all cells alive except center is the cross
    // Per spec Rule 3 example:
    //   ###       #.#
    //   .#.   →   #.#
    //   ###       #.#
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    // Per spec Rule 4 example:
    //   ##.       ##.
    //   #..   →   ##.
    //   ...       ...
    // Dead cell (1,1) has exactly 3 live neighbors → becomes alive.
    const input: [number, number][] = [
      [0, 0], [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(input);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });
  it("should handle negative coordinates", () => {
    // Vertical blinker at negative coordinates → horizontal blinker
    const vertical: [number, number][] = [
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ];
    const result = nextGeneration(vertical);
    const expected: [number, number][] = [
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ];
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(expected.map((c) => c.join(","))),
    );
  });
});
