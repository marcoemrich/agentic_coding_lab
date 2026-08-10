import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] when the current generation is empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single-cell example [(0,0)]", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for underpopulation example [(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell that has exactly two live neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("keeps center (1,1) alive when it has exactly three live neighbors", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("births dead (1,1) when its neighbors are [(0,0),(1,0),(0,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("removes overpopulated center (1,1) from the displayed dense example", () => {
    const current: [number, number][] = [
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ];
    const next = nextGeneration(current);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const keys = (cells: [number, number][]) => cells.map(cell => cell.join(",")).sort();
    expect(keys(nextGeneration(block))).toEqual(keys(block));
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next.map(cell => cell.join(",")).sort()).toEqual(["-1,1", "0,1", "1,1"]);
  });
  it("returns a blinker to its vertical state after two generations", () => {
    const initial: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const afterTwo = nextGeneration(nextGeneration(initial));
    expect(afterTwo.map(cell => cell.join(",")).sort()).toEqual(["0,0", "0,1", "0,2"]);
  });
  it("supports a blinker spanning negative x and y coordinates", () => {
    const next = nextGeneration([[-2, -3], [-2, -2], [-2, -1]]);
    expect(next.map(cell => cell.join(",")).sort()).toEqual(["-1,-2", "-2,-2", "-3,-2"]);
  });
});
