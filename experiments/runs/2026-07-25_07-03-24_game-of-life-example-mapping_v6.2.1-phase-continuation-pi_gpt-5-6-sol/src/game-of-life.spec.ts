import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

function sorted(cells: [number, number][]): [number, number][] {
  return [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}

describe("Game of Life - next generation", () => {
  it("returns no living cells for an empty generation -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single isolated cell through underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("keeps the center cell (1,1) alive with exactly three live neighbors", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("kills the center cell (1,1) with more than three live neighbors", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell with exactly three neighbors -- (1,1) becomes alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("keeps a 2x2 block unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(cells))).toEqual(sorted(cells));
  });
  it("turns a vertical blinker into [(-1,1),(0,1),(1,1)], including a negative coordinate", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sorted(result)).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("turns the horizontal blinker back into [(0,0),(0,1),(0,2)] on generation 2", () => {
    const generation0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const generation2 = nextGeneration(nextGeneration(generation0));
    expect(sorted(generation2)).toEqual(sorted(generation0));
  });
});
