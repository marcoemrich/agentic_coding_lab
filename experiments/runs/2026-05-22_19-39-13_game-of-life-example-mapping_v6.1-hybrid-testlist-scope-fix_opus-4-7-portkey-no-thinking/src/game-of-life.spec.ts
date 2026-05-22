import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid returns empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: two adjacent cells each with 1 neighbor die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 survival: blinker center (0,1) has 2 live neighbors and survives — next generation includes (0,1)", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toContainEqual([0, 1]);
  });
  it("Rule 3 overpopulation: center cell (1,1) of '###/.#./###' has >3 neighbors and dies — result does not contain (1,1)", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("Rule 4 reproduction: dead cell (1,1) with 3 live neighbors from L-shape becomes alive — result contains (1,1)", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("Block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] → same set", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(next.sort()).toEqual(block.sort());
  });
  it("Blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const sortedNext = [...next].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const expected: Array<[number, number]> = [[-1, 1], [0, 1], [1, 1]];
    expect(sortedNext).toEqual(expected);
  });
  it("handles negative coordinates — block at negative origin is unchanged", () => {
    const block: Array<[number, number]> = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    const next = nextGeneration(block);
    expect(next.sort()).toEqual(block.sort());
  });
});
