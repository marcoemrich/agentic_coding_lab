import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when input is empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill a pair of cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) as still life (each cell has 3 neighbors)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(4);
    expect(new Set(result.map((c) => `${c[0]},${c[1]}`))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const input: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(3);
    expect(new Set(result.map((c) => `${c[0]},${c[1]}`))).toEqual(
      new Set(["-1,1", "0,1", "1,1"]),
    );
  });
  it("should birth a dead cell with exactly 3 live neighbors", () => {
    // L-tromino: ##  →  ##
    //           #.      ##
    const input: [number, number][] = [[0, 1], [1, 1], [0, 0]];
    const result = nextGeneration(input);
    expect(new Set(result.map((c) => `${c[0]},${c[1]}`))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("should handle negative coordinates", () => {
    // A block at negative coordinates remains a still life
    const input: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const result = nextGeneration(input);
    expect(new Set(result.map((c) => `${c[0]},${c[1]}`))).toEqual(
      new Set(["-1,-1", "0,-1", "-1,0", "0,0"]),
    );
  });
});
