import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty array when given an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("Rule 1 - Underpopulation: a live cell with fewer than 2 live neighbors dies -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("Rule 2 - Survival: a live cell with 2 or 3 live neighbors lives on -- center (1,1) with neighbors (0,0) and (0,2) survives into Gen 1", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 2],
      [1, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });

  it("Rule 3 - Overpopulation: a live cell with more than 3 live neighbors dies -- center (1,1) surrounded by 4 diagonal neighbors (0,0),(2,0),(0,2),(2,2) is excluded from Gen 1", () => {
    const result = nextGeneration([
      [1, 1],
      [0, 0],
      [2, 0],
      [0, 2],
      [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });

  it("Rule 4 - Reproduction: a dead cell with exactly 3 live neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });

  it("Single cell dies -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Block (still life) -- [(0,0),(1,0),(0,1),(1,1)] stays unchanged across a generation", () => {
    const input: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(input);
    const resultSet = new Set(result.map((c) => c.join(",")));
    const inputSet = new Set(input.map((c) => c.join(",")));
    expect(resultSet).toEqual(inputSet);
  });

  it("Blinker (oscillator) generation 0 -> 1 -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet).toEqual(new Set(["-1,1", "0,1", "1,1"]));
  });

  it("Blinker (oscillator) generation 1 -> 2 -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    const resultSet = new Set(result.map((c) => c.join(",")));
    expect(resultSet).toEqual(new Set(["0,0", "0,1", "0,2"]));
  });

  it("Handles negative coordinates -- underpopulation rule applies identically when cells are located at negative x/y, e.g. [(-3,-3),(-2,-3)] -> []", () => {
    const result = nextGeneration([
      [-3, -3],
      [-2, -3],
    ]);
    expect(result).toEqual([]);
  });
});
