import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("should return empty for empty input -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation
  it("should kill both cells with 1 neighbor each -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 - Survival
  it("should keep center cell with 2 neighbors alive -- (0,1) survives in blinker", () => {
    const gen0: [number, number][] = [
      [0, 0], [0, 1], [0, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([0, 1]);
  });

  // Rule 3 - Overpopulation
  it("should kill center cell with 4 neighbors -- (1,1) dies", () => {
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Rule 4 - Reproduction
  it("should bring dead cell with exactly 3 neighbors to life -- (1,1) born", () => {
    const gen0: [number, number][] = [
      [0, 0], [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 1]);
  });

  // Pattern examples
  it("blinker: [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen0);
    const sort = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(result)).toEqual(sort([[-1, 1], [0, 1], [1, 1]]));
  });
  it("block still life: [(0,0),(1,0),(0,1),(1,1)] -> unchanged", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(gen0);
    const sort = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(result)).toEqual(sort(gen0));
  });
  it("blinker oscillates back after 2 generations to vertical", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(gen0));
    const sort = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sort(gen2)).toEqual(sort(gen0));
  });
});
