import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

const sorted = (cells: Cell[]): Cell[] => cells.sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("nextGeneration", () => {
  it("empty living cells [] produce []", () => {
    expect(sorted(nextGeneration([]))).toEqual([]);
  });
  it("single cell [(0,0)] dies to [] with zero neighbors", () => {
    expect(sorted(nextGeneration([[0, 0]]))).toEqual([]);
  });
  it("underpopulation: [(0,1),(1,1)] each have one neighbor and produce []", () => {
    expect(sorted(nextGeneration([[0, 1], [1, 1]]))).toEqual([]);
  });
  it("survival: a live (1,1) with two neighbors stays alive", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toContainEqual([1, 1]);
  });
  it("survival: live (1,1) with three neighbors stays alive", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("overpopulation: live (1,1) with four neighbors dies", () => {
    expect(nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]])).not.toContainEqual([1, 1]);
  });
  it("reproduction: dead (1,1) with [(0,0),(1,0),(0,1)] becomes alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("block [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("blinker [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("blinker second generation returns to [(0,0),(0,1),(0,2)]", () => {
    expect(sorted(nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]])))).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("isolated patterns far apart evolve independently on an unbounded sparse grid including negative x and y", () => {
    const input: Cell[] = [[-100, -101], [-100, -100], [-100, -99], [100, 99], [100, 100], [100, 101]];
    const expected: Cell[] = [[-101, -100], [-100, -100], [-99, -100], [99, 100], [100, 100], [101, 100]];
    expect(sorted(nextGeneration(input))).toEqual(sorted(expected));
  });
});
