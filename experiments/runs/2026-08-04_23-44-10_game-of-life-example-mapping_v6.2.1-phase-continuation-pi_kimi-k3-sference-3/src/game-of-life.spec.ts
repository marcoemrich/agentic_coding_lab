import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty for empty input -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation, Rule 1 example) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should let center cell with 3 neighbors survive (Rule 2 example) -- [(0,0),(1,0),(2,0),(1,1)] -> center (1,1) survives", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("should kill center cell with 4 neighbors (overpopulation, Rule 3 example) -- 3x3 minus center -> center (1,1) dies", () => {
    const ring: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1],         [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const next = nextGeneration([...ring, [1, 1]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("should revive dead cell with exactly 3 neighbors (reproduction, Rule 4 example) -- [(0,0),(1,0),(0,1)] -> adds (1,1)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("should keep block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it("should oscillate blinker from vertical to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(next).toHaveLength(3);
  });
  it("should oscillate blinker back to vertical on second generation -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
    expect(next).toHaveLength(3);
  });
  it("should handle negative coordinates -- [(-1,-1)] -> []", () => {
    expect(nextGeneration([[-1, -1]])).toEqual([]);
    const block: [number, number][] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    const next = nextGeneration(block);
    expect(next).toEqual(expect.arrayContaining(block));
    expect(next).toHaveLength(4);
  });
});
