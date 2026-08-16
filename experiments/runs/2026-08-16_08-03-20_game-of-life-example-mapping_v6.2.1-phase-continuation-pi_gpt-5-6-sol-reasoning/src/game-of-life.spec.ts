import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] when the current generation is empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at (0,0), producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation to adjacent cells [(0,1),(1,1)], producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with two or three neighbors alive (survival)", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("kills center (1,1) when it has more than three live neighbors (overpopulation)", () => {
    const next = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("turns dead (1,1) alive from [(0,0),(1,0),(0,1)], producing a 2x2 block (reproduction)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("turns the horizontal blinker back into the original vertical blinker on generation 2", () => {
    const generationOne = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(nextGeneration(generationOne)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("evolves cells correctly across negative x and y coordinates on the infinite grid", () => {
    expect(nextGeneration([[-2, -2], [-2, -1], [-2, 0]])).toEqual([
      [-3, -1], [-2, -1], [-1, -1],
    ]);
  });
});
