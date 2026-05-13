import { describe, it, expect } from "vitest";
import { advance } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when starting with empty grid", () => {
    expect(advance([], 1)).toEqual([]);
  });
  it("should return input unchanged when steps is 0", () => {
    expect(advance([[1, 2]], 0)).toEqual([[1, 2]]);
  });
  it("should kill a single isolated cell after 1 step (underpopulation)", () => {
    expect(advance([[5, 5]], 1)).toEqual([]);
  });
  it("should keep a still-life (tub) unchanged after 1 step", () => {
    const tub: [number, number][] = [[0, 1], [1, 0], [1, 2], [2, 1]];
    expect(advance(tub, 1)).toEqual([[0, 1], [1, 0], [1, 2], [2, 1]]);
  });
  it("should reproduce: dead cell with exactly 3 live neighbors becomes alive", () => {
    // [0,0], [1,0], [0,1] each have the dead cell [1,1] as a neighbor
    // [1,1] has exactly 3 live neighbors → becomes alive
    expect(advance([[0, 0], [0, 1], [1, 0]], 1)).toContainEqual([1, 1]);
  });
});
