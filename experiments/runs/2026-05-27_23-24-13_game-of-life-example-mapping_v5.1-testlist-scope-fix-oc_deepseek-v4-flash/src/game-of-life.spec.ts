import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a single live cell due to underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill two cells that are neighbors due to underpopulation -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should keep a live cell with exactly 3 neighbors alive (survival)", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation) -- center dies", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction) -- dead cell becomes alive", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate blinker pattern from vertical to horizontal -- [(-1,1), (0,1), (1,1)]", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
    expect(result).toHaveLength(3);
  });
  it("should keep block pattern unchanged (still life) -- unchanged", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(gen0)).toEqual(expect.arrayContaining(gen0));
    expect(nextGeneration(gen0)).toHaveLength(4);
  });
  it("should handle negative coordinates correctly -- cells at negative positions", () => {
    const gen0: [number, number][] = [[-1, 0], [0, 0], [1, 0]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([0, 0]);
  });
});