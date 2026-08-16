import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single cell at [(0,0)] by underpopulation, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills adjacent cells [(0,1),(1,1)] with one neighbor each, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps live center cell (1,1) alive with exactly three neighbors", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("kills the overpopulated center (1,1) and produces the six outer cells", () => {
    const outerCells: [number, number][] = [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]];

    expect(nextGeneration([...outerCells, [1, 1]])).toEqual([
      ...outerCells,
      [-1, 1],
      [3, 1],
    ]);
  });
  it("reproduces at dead cell (1,1) with exactly three neighbors, producing a 2x2 block", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(next).toHaveLength(block.length);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("evolves vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(next).toHaveLength(horizontal.length);
    expect(next).toEqual(expect.arrayContaining(horizontal));
  });
  it("evolves horizontal blinker [(-1,1),(0,1),(1,1)] back into [(0,0),(0,1),(0,2)]", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);

    expect(next).toHaveLength(vertical.length);
    expect(next).toEqual(expect.arrayContaining(vertical));
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(nextGeneration(block)).toEqual(block);
  });
  it("handles an isolated cell at negative coordinates [(-2,-3)] by producing []", () => {
    expect(nextGeneration([[-2, -3]])).toEqual([]);
  });
});
