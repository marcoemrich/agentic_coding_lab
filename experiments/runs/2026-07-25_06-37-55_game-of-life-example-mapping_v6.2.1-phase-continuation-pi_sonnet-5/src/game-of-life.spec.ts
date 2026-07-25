import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns an empty array when given an empty grid -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell with 0 neighbors dies (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - two adjacent live cells each with only 1 neighbor die (underpopulation) -- [(0,1),(1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ])
    ).toEqual([]);
  });
  it("Rule 4 - dead cell with exactly 3 live neighbors becomes alive (reproduction), L-shape fills into a block -- [(0,0),(1,0),(0,1)] -> [(0,0),(0,1),(1,0),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(result.sort()).toEqual(
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ].sort()
    );
  });
  it("Rule 2 - live cell with exactly 3 neighbors survives (T-tromino), while ends die and new cells are born -- [(0,0),(1,0),(2,0),(1,1)] -> [(0,0),(0,1),(1,-1),(1,0),(1,1),(2,0),(2,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);
    expect(result.sort()).toEqual(
      [
        [0, 0],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
        [2, 0],
        [2, 1],
      ].sort()
    );
  });
  it("Rule 3 - live cell with more than 3 neighbors dies (overpopulation), full 3x3 block's center dies while corners survive and new cells are born -- 9-cell 3x3 square -> [(-1,1),(0,0),(0,2),(1,-1),(1,3),(2,0),(2,2),(3,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(result.sort()).toEqual(
      [
        [-1, 1],
        [0, 0],
        [0, 2],
        [1, -1],
        [1, 3],
        [2, 0],
        [2, 2],
        [3, 1],
      ].sort()
    );
  });
  it("Block (still life) remains unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
    expect(result.sort()).toEqual(
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ].sort()
    );
  });
  it("Blinker (oscillator) gen 0 -> gen 1 flips from vertical to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(result.sort()).toEqual(
      [
        [-1, 1],
        [0, 1],
        [1, 1],
      ].sort()
    );
  });
  it("Blinker (oscillator) gen 1 -> gen 2 flips back from horizontal to vertical -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expect(result.sort()).toEqual(
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ].sort()
    );
  });
});
