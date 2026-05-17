import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with only one neighbor (underpopulation)", () => {
    // Two adjacent cells - each has only 1 neighbor, both die
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep alive a cell with 2 or 3 neighbors (survival)", () => {
    // 2x2 block - each cell has exactly 3 neighbors, all survive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });
  it("should kill a cell with more than 3 neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 live neighbors in this pattern:
    // ###
    // .#.
    // ###
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 neighbors (reproduction)", () => {
    // L-shape: dead cell (1,1) has exactly 3 live neighbors → becomes alive
    // ##.
    // #..
    // ...
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle the blinker oscillator pattern", () => {
    // Vertical blinker rotates to horizontal
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen0);
    const sorted = result.map(([x, y]) => `${x},${y}`).sort();
    const expected = [[-1, 1], [0, 1], [1, 1]].map(([x, y]) => `${x},${y}`).sort();
    expect(sorted).toEqual(expected);
  });
  it("should handle negative coordinates", () => {
    // Block at negative coordinates - still life, all survive
    const input: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const result = nextGeneration(input);
    const sorted = result.map(([x, y]) => `${x},${y}`).sort();
    const expected = input.map(([x, y]) => `${x},${y}`).sort();
    expect(sorted).toEqual(expected);
  });
});
