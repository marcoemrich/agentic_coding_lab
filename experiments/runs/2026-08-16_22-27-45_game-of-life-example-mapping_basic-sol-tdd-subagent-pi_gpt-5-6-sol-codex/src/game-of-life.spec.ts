import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single live cell [(0,0)] because it has no neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for adjacent cells [(0,1),(1,1)] because each has one neighbor (underpopulation example)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live center cell with exactly three live neighbors (survival example)", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("removes a live center cell with four live neighbors (overpopulation example)", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);

    expect(next).not.toContainEqual([0, 0]);
  });
  it("creates dead cell (1,1) from [(0,0),(1,0),(0,1)] (reproduction example)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(nextGeneration(block)).toEqual(block);
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("turns horizontal blinker [(-1,1),(0,1),(1,1)] back into [(0,0),(0,1),(0,2)]", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]])).toEqual([
      [0, 0], [0, 1], [0, 2],
    ]);
  });
  it("handles reproduction and survival at negative coordinates on the infinite sparse grid", () => {
    expect(nextGeneration([[-2, -2], [-1, -2], [-2, -1]])).toEqual([
      [-2, -2], [-1, -2], [-2, -1], [-1, -1],
    ]);
  });
});
