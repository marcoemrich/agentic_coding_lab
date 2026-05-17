import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single isolated live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a 2x2 block stable (each cell has 3 neighbors)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("transforms a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect([...result].sort()).toEqual([...horizontal].sort());
  });
  it("kills a live cell with 4 neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 neighbors: (0,0), (2,0), (0,2), (2,2)
    const input: [number, number][] = [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]];
    const result = nextGeneration(input);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("brings a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    // From spec: [[0,0],[1,0],[0,1]] - dead cell at (1,1) has exactly 3 neighbors
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });
  it("handles negative coordinates correctly", () => {
    // A 2x2 block at negative coordinates should remain stable
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(block);
    expect([...result].sort()).toEqual([...block].sort());
  });
});
