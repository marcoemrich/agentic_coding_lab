import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die from underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) — [(0,0),(1,0),(0,1)] → includes (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("live cell with 2 or 3 live neighbors survives (survival) — top center of ###/.../.#. survives", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("live cell with more than 3 live neighbors dies from overpopulation — full 3x3 center (1,1) dies", () => {
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same 4 cells", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("handles negative coordinates — blinker at negative positions oscillates correctly", () => {
    const result = nextGeneration([[-10, -10], [-10, -9], [-10, -8]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-11, -9]);
    expect(result).toContainEqual([-10, -9]);
    expect(result).toContainEqual([-9, -9]);
  });
});
