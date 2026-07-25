import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when input is empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell -- Rule 1: underpopulation, input [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells -- Rule 1 spec example, input [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should kill isolated cells with 0 neighbors -- Rule 1", () => {
    expect(nextGeneration([[5, 5], [10, 10], [-3, 7]])).toEqual([]);
  });
  it("should preserve a block (2x2 square) unchanged -- Rule 2: every cell has 2 neighbors", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block).sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });
  it("should transform horizontal 3-cell line to vertical 3-cell line -- center cell with 2 neighbors survives", () => {
    const horizontal: Array<[number, number]> = [[0, 0], [1, 0], [2, 0]];
    const vertical: Array<[number, number]> = [[1, -1], [1, 0], [1, 1]];
    expect(nextGeneration(horizontal).sort()).toEqual(vertical.sort());
  });
  it("should kill the center of a 3x3 minus center (Rule 3: overpopulation, 4 neighbors)", () => {
    // 3x3 grid with center (1,1) removed (8 ring cells).
    // Corners have 2 neighbours -> survive.
    // Edges have 4 neighbours -> die (overpopulation).
    // 4 new births appear just outside each edge (each tip has 3 live neighbours).
    const ring: Array<[number, number]> = [
      [0, 0], [1, 0], [2, 0],
      [0, 1],         [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const expected: Array<[number, number]> = [
      [0, 0],         [2, 0],
      [0, 2],         [2, 2],
      [-1, 1], [1, -1], [1, 3], [3, 1],
    ];
    expect(nextGeneration(ring).sort()).toEqual(expected.sort());
  });
  it("should reproduce when L-shape becomes block -- Rule 4: dead cell with 3 neighbors born", () => {
    // Spec example for Rule 4:
    // Gen 0: [(0,0),(1,0),(0,1)]  (L-shape)
    // Gen 1: [(0,0),(1,0),(0,1),(1,1)] (block; (1,1) is born with 3 neighbours)
    const lShape: Array<[number, number]> = [[0, 0], [1, 0], [0, 1]];
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(lShape).sort()).toEqual(block.sort());
  });
  it("should oscillate a blinker through a full period (Gen 0 -> Gen 1 -> Gen 2 -> Gen 0)", () => {
    // Vertical blinker:
    const vertical: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    // Horizontal blinker:
    const horizontal: Array<[number, number]> = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(vertical).sort()).toEqual(horizontal.sort());
    expect(nextGeneration(horizontal).sort()).toEqual(vertical.sort());
  });
  it("should handle negative coordinates correctly", () => {
    // A block at negative coordinates should be a still life.
    const block: Array<[number, number]> = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    expect(nextGeneration(block).sort()).toEqual(block.sort());
    // And a blinker at negative coordinates should oscillate.
    const vertical: Array<[number, number]> = [[-5, -3], [-5, -2], [-5, -1]];
    const horizontal: Array<[number, number]> = [[-6, -2], [-5, -2], [-4, -2]];
    expect(nextGeneration(vertical).sort()).toEqual(horizontal.sort());
  });
  it("should handle multiple disjoint patterns independently", () => {
    // Two blocks separated by a large gap -- each should be a still life.
    const block1: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const block2: Array<[number, number]> = [[100, 100], [101, 100], [100, 101], [101, 101]];
    const input = [...block1, ...block2];
    const expected = [...block1, ...block2];
    expect(nextGeneration(input).sort()).toEqual(expected.sort());
  });
});
