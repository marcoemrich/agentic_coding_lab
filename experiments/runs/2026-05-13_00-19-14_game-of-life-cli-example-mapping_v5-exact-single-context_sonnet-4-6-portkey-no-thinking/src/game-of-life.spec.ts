import { describe, it, expect } from "vitest";
import { advance } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(advance([], 1)).toEqual([]);
  });
  it("should return cells unchanged when steps is 0", () => {
    expect(advance([[1, 2]], 0)).toEqual([[1, 2]]);
  });
  it("should kill a single isolated cell after one step", () => {
    expect(advance([[5, 5]], 1)).toEqual([]);
  });
  it("should keep a still life (tub) alive after one step", () => {
    const tub: [number, number][] = [[0, 1], [1, 0], [1, 2], [2, 1]];
    expect(advance(tub, 1)).toEqual([[0, 1], [1, 0], [1, 2], [2, 1]]);
  });
  it("should reproduce a dead cell with exactly 3 live neighbors", () => {
    // L-shape: dead cell at (1,1) has 3 live neighbors → born
    expect(advance([[0, 0], [1, 0], [0, 1]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});
