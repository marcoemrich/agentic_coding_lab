import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation: 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation: 1 neighbor each)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 live neighbors and dies
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
    ];
    const result = nextGeneration(input);
    const keys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(keys.has("1,1")).toBe(false);
  });
  it("should keep a live cell alive with 2 or 3 neighbors (survival)", () => {
    // Top row [(0,0),(1,0),(2,0)] + (1,2). Cell (1,1) is dead with 3 neighbors → reproduces.
    // Cell (1,0) has neighbors (0,0) and (2,0) = 2 neighbors → survives.
    const input: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 2]];
    const result = nextGeneration(input);
    const keys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(keys.has("1,0")).toBe(true);
  });
  it("should bring a dead cell to life with exactly 3 neighbors (reproduction)", () => {
    // Dead cell (1,1) has 3 live neighbors: (0,0), (1,0), (0,1) → becomes alive
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    const keys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(keys.has("1,1")).toBe(true);
  });
  it("should preserve a block pattern (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
  });
  it("should oscillate a blinker pattern from vertical to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["-1,1", "0,1", "1,1"])
    );
  });
  it("should handle negative coordinates correctly", () => {
    // Block pattern at negative coordinates - should be preserved
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["-5,-5", "-4,-5", "-5,-4", "-4,-4"])
    );
  });
});
