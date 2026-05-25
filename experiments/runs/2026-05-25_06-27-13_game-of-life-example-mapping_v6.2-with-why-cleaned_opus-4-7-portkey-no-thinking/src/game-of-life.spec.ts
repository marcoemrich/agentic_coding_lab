import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells both die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival: live cell with 2 neighbors survives — middle of vertical 3-in-a-row keeps (0,1)", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toContainEqual([0, 1]);
  });
  it("Rule 3 Overpopulation: center of full 3x3 dies — next gen excludes (1,1)", () => {
    const full3x3: Cell[] = [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]];
    expect(nextGeneration(full3x3)).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive — L-shape produces (1,1)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("Block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] → same set", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(new Set(next.map(c => c.join(",")))).toEqual(
      new Set(block.map(c => c.join(",")))
    );
  });
  it("Blinker vertical becomes horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(next.map(c => c.join(",")))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map(c => c.join(",")))
    );
  });
  it("handles negative coordinates — blinker at negative origin oscillates correctly", () => {
    const next = nextGeneration([[-10, -10], [-10, -9], [-10, -8]]);
    expect(new Set(next.map(c => c.join(",")))).toEqual(
      new Set([[-11, -9], [-10, -9], [-9, -9]].map(c => c.join(",")))
    );
  });
});
