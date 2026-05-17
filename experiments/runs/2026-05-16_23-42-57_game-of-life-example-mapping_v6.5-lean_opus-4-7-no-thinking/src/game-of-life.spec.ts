import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns empty array when input is empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a 2x2 block alive (still life, survival)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("oscillates a vertical blinker to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("kills overpopulated center of a 3x3 filled grid", () => {
    const grid: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(grid);
    // center (1,1) dies from overpopulation (8 neighbors)
    expect(result).not.toContainEqual([1, 1]);
    // corners survive (3 neighbors each)
    expect(result).toEqual(expect.arrayContaining([[0, 0], [2, 0], [0, 2], [2, 2]]));
  });
  it("revives a dead cell with exactly 3 live neighbors (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1) — dead cell (1,1) has 3 live neighbors
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lShape);
    expect(result).toContainEqual([1, 1]);
  });
  it("handles negative coordinates correctly", () => {
    const blinker: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(blinker);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
