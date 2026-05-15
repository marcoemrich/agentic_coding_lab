import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array when given no cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a 2x2 block unchanged (each cell has 3 neighbors)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(block.map(([x, y]) => `${x},${y}`))
    );
  });
  it("should rotate a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["-1,1", "0,1", "1,1"])
    );
  });
  it("should kill an overpopulated cell (more than 3 neighbors)", () => {
    // Center (1,1) has 4 live neighbors → dies
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2],         [2, 2],
    ];
    const result = nextGeneration(input);
    const resultKeys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultKeys.has("1,1")).toBe(false);
  });
  it("should bring a dead cell to life with exactly 3 neighbors (reproduction)", () => {
    // Dead cell (1,1) has exactly 3 live neighbors → becomes alive
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    const resultKeys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultKeys.has("1,1")).toBe(true);
  });
  it("should handle negative coordinates correctly", () => {
    // Vertical blinker at x=-5: cells (-5,-1),(-5,0),(-5,1)
    // Should rotate to horizontal: (-6,0),(-5,0),(-4,0)
    const vertical: [number, number][] = [[-5, -1], [-5, 0], [-5, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["-6,0", "-5,0", "-4,0"])
    );
  });
});
