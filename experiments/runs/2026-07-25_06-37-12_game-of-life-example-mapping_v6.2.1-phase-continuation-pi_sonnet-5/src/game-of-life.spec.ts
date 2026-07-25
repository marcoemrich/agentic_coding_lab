import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("single isolated cell dies (0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 Underpopulation: two adjacent cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ])
    ).toEqual([]);
  });

  it("Rule 2 Survival: cell with 3 neighbors survives -- [(0,0),(1,0),(2,0),(1,1)], center (1,1) has 3 neighbors and survives", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });

  it("Rule 3 Overpopulation: center cell with 4 neighbors dies -- 3x3 ring [(0,0),(1,0),(2,0),(0,1),(2,1),(0,2),(1,2),(2,2)], center (1,1) has 4 neighbors and dies", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });

  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive -- [(0,0),(1,0),(0,1)], dead cell (1,1) has exactly 3 neighbors and becomes alive", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });

  it("Blinker oscillator Gen0 -> Gen1 -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });

  it("Blinker oscillator Gen1 -> Gen2 (returns to original) -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  it("Block still life remains unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const input: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(input);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });

  it("handles negative coordinates: block shifted to negative quadrant remains stable -- [(-2,-2),(-1,-2),(-2,-1),(-1,-1)] -> [(-2,-2),(-1,-2),(-2,-1),(-1,-1)]", () => {
    const input: [number, number][] = [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
    ];
    const result = nextGeneration(input);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([
      [-2, -2],
      [-2, -1],
      [-1, -2],
      [-1, -1],
    ]);
  });
});
