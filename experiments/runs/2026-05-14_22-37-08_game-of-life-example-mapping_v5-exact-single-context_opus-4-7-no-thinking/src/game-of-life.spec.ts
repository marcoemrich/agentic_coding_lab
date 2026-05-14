import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const asCellSet = (cells: [number, number][]): Set<string> =>
  new Set(cells.map(([x, y]) => `${x},${y}`));

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array when input is empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill both cells in a two-cell pair (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) unchanged (each cell has 3 neighbors)", () => {
    const input: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(input);
    expect(asCellSet(result)).toEqual(asCellSet(input));
  });
  it("should transform a vertical blinker into a horizontal blinker", () => {
    const input: [number, number][] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const expected = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(input);
    expect(asCellSet(result)).toEqual(asCellSet(expected));
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    const input: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const expected = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(input);
    expect(asCellSet(result)).toEqual(asCellSet(expected));
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Plus shape: center has 4 live neighbors and dies
    const input: [number, number][] = [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ];
    const result = nextGeneration(input);
    expect(asCellSet(result).has("1,1")).toBe(false);
  });
  it("should handle negative coordinates", () => {
    // Blinker centered around negative coords: (-5, -10), (-5, -9), (-5, -8)
    const input: [number, number][] = [
      [-5, -10],
      [-5, -9],
      [-5, -8],
    ];
    const expected = [
      [-6, -9],
      [-5, -9],
      [-4, -9],
    ];
    const result = nextGeneration(input);
    expect(asCellSet(result)).toEqual(asCellSet(expected));
  });
});
