import { describe, it, expect } from "vitest";
import { advance } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(advance([], 1)).toEqual([]);
  });
  it("should return no live cells after one step with a single live cell (underpopulation)", () => {
    expect(advance([[0, 0]], 1)).toEqual([]);
  });
  it("should keep a still-life (tub) unchanged after one step", () => {
    expect(advance([[0, 1], [1, 0], [1, 2], [2, 1]], 1)).toEqual([[0, 1], [1, 0], [1, 2], [2, 1]]);
  });
  it("should evolve a blinker (oscillator) from vertical to horizontal after one step", () => {
    expect(advance([[1, 0], [1, 1], [1, 2]], 1)).toEqual([[0, 1], [1, 1], [2, 1]]);
  });
  it("should return the same grid after zero steps", () => {
    expect(advance([[0, 1], [1, 0], [1, 2], [2, 1]], 0)).toEqual([[0, 1], [1, 0], [1, 2], [2, 1]]);
  });
  it("should return output cells sorted lexicographically by x then y", () => {
    // tub input given in unsorted order — output must be sorted by x then y
    expect(advance([[2, 1], [1, 2], [1, 0], [0, 1]], 0)).toEqual([[0, 1], [1, 0], [1, 2], [2, 1]]);
  });
});
