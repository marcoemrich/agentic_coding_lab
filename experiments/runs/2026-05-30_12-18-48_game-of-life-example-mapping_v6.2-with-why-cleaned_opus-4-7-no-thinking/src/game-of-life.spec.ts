import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("rule 1 underpopulation: two adjacent cells both die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life survives unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("rule 2 survival: live cell with 2 neighbors survives — center of vertical 3-line survives", () => {
    const cells: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const next = nextGeneration(cells);
    expect(next).toEqual(expect.arrayContaining([[0, 1]]));
  });
  it("rule 3 overpopulation: center cell with 4+ neighbors dies — full 3x3 center dies", () => {
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const next = nextGeneration(cells);
    expect(next).not.toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("rule 4 reproduction: dead cell with exactly 3 neighbors becomes alive — L-shape produces new cell at (1,1)", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(cells);
    expect(next).toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("blinker oscillates vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const cells: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const next = nextGeneration(cells);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("handles negative coordinates — block at negative offset survives", () => {
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const next = nextGeneration(block);
    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining(block));
  });
});
