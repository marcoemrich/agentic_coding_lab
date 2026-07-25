import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life next generation", () => {
  it("a single live cell at [(0,0)] dies, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("the underpopulation pair [(0,1),(1,1)] dies, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("the survival example produces [(1,0),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]])).toEqual([
      [1, -1], [0, 0], [1, 0], [2, 0],
    ]);
  });
  it("the reproduction example [(0,0),(1,0),(0,1)] produces [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });
  it("the overpopulation example produces the stated [(0,0),(2,0),(0,1),(2,1),(0,2),(2,2)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])).toEqual([
      [1, -1], [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, 3],
    ]);
  });
  it("the block still life remains [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("a vertical blinker produces its horizontal next generation [(-1,1),(0,1),(1,1)] and returns vertical on generation two", () => {
    const vertical = [[0, 0], [0, 1], [0, 2]] as [number, number][];
    const horizontal = [[-1, 1], [0, 1], [1, 1]];

    expect(nextGeneration(vertical)).toEqual(horizontal);
    expect(nextGeneration(horizontal)).toEqual(vertical);
  });
  it("a negative-coordinate vertical blinker evolves correctly, demonstrating infinite sparse coordinates", () => {
    expect(nextGeneration([[-2, -2], [-2, -1], [-2, 0]])).toEqual([
      [-3, -1], [-2, -1], [-1, -1],
    ]);
  });
});
