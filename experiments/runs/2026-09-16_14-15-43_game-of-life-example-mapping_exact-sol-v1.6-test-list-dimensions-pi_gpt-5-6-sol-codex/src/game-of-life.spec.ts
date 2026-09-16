import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("underpopulation: transforms the single live cell [(0,0)] into []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation example: transforms adjacent cells [(0,1),(1,1)] into []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("survival with 2 neighbors: keeps a live cell that has exactly 2 live neighbors", () => {
    const next = nextGeneration([[-1, 0], [0, 0], [1, 0]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("survival example with 3 neighbors: keeps the center cell (1,1)", () => {
    const next = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("overpopulation example: removes the center cell (1,1) when it has more than 3 live neighbors", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduction example: transforms [(0,0),(1,0),(0,1)] into the block including newborn (1,1)", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("blinker generation 1: transforms [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("block still life: leaves [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    const next = nextGeneration(block);

    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("negative coordinates: leaves the block [(-2,-2),(-1,-2),(-2,-1),(-1,-1)] unchanged", () => {
    const block = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]] as [number, number][];
    const next = nextGeneration(block);

    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("unbounded sparse grid: leaves a block at coordinates around (1000000,-1000000) unchanged", () => {
    const block = [
      [1000000, -1000000], [1000001, -1000000],
      [1000000, -999999], [1000001, -999999],
    ] as [number, number][];
    const next = nextGeneration(block);

    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("blinker generation 2: applying two generations restores [(0,0),(0,1),(0,2)]", () => {
    const generationTwo = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));

    expect(generationTwo).toHaveLength(3);
    expect(generationTwo).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
});
