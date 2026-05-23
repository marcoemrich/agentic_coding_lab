import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array when given an empty array (no living cells)", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("Rule 1 (Underpopulation): a single live cell [(0,0)] dies → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 (Underpopulation): two adjacent cells [(0,1), (1,1)] each have 1 neighbor and die → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("Rule 2 (Survival): in row ### at y=0 plus cell (1,2), the center cell (1,0) has 3 live neighbors and survives — next gen contains (1,0)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(result).toContainEqual([1, 0]);
  });

  it("Rule 3 (Overpopulation): in a full 3x3 grid, the center cell (1,1) has 4 neighbors and dies — (1,1) is not in next gen", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });

  it("Rule 4 (Reproduction): L-shape [(0,2),(1,2),(0,1)] — dead cell (1,1) has exactly 3 neighbors and becomes alive — next gen contains (1,1)", () => {
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] remains unchanged after one generation", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(c => c.join(",")))).toEqual(new Set(input.map(c => c.join(","))));
  });

  it("Blinker oscillator: vertical [(0,0),(0,1),(0,2)] becomes horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map(c => c.join(",")))).toEqual(new Set([[-1, 1], [0, 1], [1, 1]].map(c => c.join(","))));
  });

  it("Blinker oscillator: horizontal [(-1,1),(0,1),(1,1)] returns to vertical [(0,0),(0,1),(0,2)] (period 2)", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(new Set(result.map(c => c.join(",")))).toEqual(new Set([[0, 0], [0, 1], [0, 2]].map(c => c.join(","))));
  });

  it("should handle negative coordinates: blinker centered at origin produces cells with negative x (e.g. (-1,1))", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([-1, 1]);
  });
});
