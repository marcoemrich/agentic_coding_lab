import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// The contract does not specify output order, so compare in a canonical order.
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[1] - b[1] || a[0] - b[0]);

describe("Game of Life - Next Generation", () => {
  it("should return an empty grid for an empty grid — []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors — [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: should kill both cells that each have 1 neighbor — [(0,1), (1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  // Note: the spec's Rule 2 and Rule 3 diagrams show only a 3x3 window. On an
  // infinite grid those generations also spawn cells outside that window (e.g.
  // (1,-1)), so the drawn Gen 1 is a crop, not the full result. These tests
  // assert the full rule-derived generation.
  it("Rule 2 Survival: live cell (1,0) with 2 live neighbors survives — [(0,0),(1,0),(2,0),(1,2)] becomes [(1,-1),(1,0),(0,1),(2,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]))).toEqual([
      [1, -1], [1, 0], [0, 1], [2, 1],
    ]);
  });
  it("Rule 3 Overpopulation: live cell (1,1) with 4 live neighbors dies — [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] becomes [(1,-1),(0,0),(1,0),(2,0),(0,2),(1,2),(2,2),(1,3)] (center (1,1) absent)", () => {
    expect(
      sorted(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])),
    ).toEqual([
      [1, -1], [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, 3],
    ]);
  });
  it("Rule 4 Reproduction: dead cell (1,1) with exactly 3 live neighbors becomes alive — [(0,0),(1,0),(0,1)] becomes [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("Block still life: should stay unchanged — [(0,0),(1,0),(0,1),(1,1)] becomes [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("Blinker: vertical becomes horizontal — [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("Blinker: horizontal becomes vertical again after second generation — [(-1,1),(0,1),(1,1)] becomes [(0,0),(0,1),(0,2)]", () => {
    expect(sorted(nextGeneration([[-1, 1], [0, 1], [1, 1]]))).toEqual([
      [0, 0], [0, 1], [0, 2],
    ]);
  });
});
