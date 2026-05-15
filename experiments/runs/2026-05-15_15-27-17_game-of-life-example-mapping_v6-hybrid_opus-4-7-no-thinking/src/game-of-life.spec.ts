import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
      ]),
    ).toEqual([]);
  });
  it("should keep a 2x2 block stable (each cell has 3 neighbors)", () => {
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const vertical: [number, number][] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const horizontal: [number, number][] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
  it("should kill a live cell with 4 neighbors (overpopulation)", () => {
    // Plus shape: center cell has 4 neighbors
    const input: [number, number][] = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 1],
    ];
    const result = nextGeneration(input);
    // Center (1,1) should not be in next generation (had 4 neighbors)
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("should birth a dead cell with exactly 3 neighbors (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1) — dead cell (1,1) has 3 live neighbors
    const input: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(input);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });
  it("should handle negative coordinates correctly", () => {
    // Vertical blinker shifted to negative coords
    const vertical: [number, number][] = [
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ];
    const horizontal: [number, number][] = [
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
});
