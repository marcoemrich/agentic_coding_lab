import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at [(0,0)] -- expected []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation to adjacent cells [(0,1),(1,1)] -- expected []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("keeps the center live cell (1,1) with exactly 3 live neighbors", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("kills the center live cell (1,1) with more than 3 live neighbors", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduces at dead cell (1,1) with exactly 3 neighbors -- triangle becomes a block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toHaveLength(4);
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it("evolves vertical blinker to horizontal and back after two generations", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const generation1 = nextGeneration(vertical);
    expect(generation1).toEqual(expect.arrayContaining(horizontal));
    expect(generation1).toHaveLength(3);
    expect(nextGeneration(generation1)).toEqual(expect.arrayContaining(vertical));
    expect(nextGeneration(generation1)).toHaveLength(3);
  });
  it("supports an infinite sparse grid with negative coordinates", () => {
    const vertical: [number, number][] = [[-10, -11], [-10, -10], [-10, -9]];
    const expected: [number, number][] = [[-11, -10], [-10, -10], [-9, -10]];
    const next = nextGeneration(vertical);
    expect(next).toEqual(expect.arrayContaining(expected));
    expect(next).toHaveLength(3);
  });
});
