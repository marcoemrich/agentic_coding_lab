import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty input returns empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation, 1 neighbor each) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] stays the same", () => {
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("live cell with 2 neighbors survives (Rule 2 survival) — live cell with 2 live neighbors stays alive", () => {
    // (0,0),(1,0),(2,0): center (1,0) is live with 2 live neighbors → survives
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
    expect(result).toContainEqual([1, 0]);
  });
  it("live cell with 4 neighbors dies (Rule 3 overpopulation) — center of plus+corners dies", () => {
    // Cells: (0,0),(2,0),(1,1),(0,2),(2,2) — center (1,1) has 4 diagonal neighbors
    const result = nextGeneration([
      [0, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (Rule 4 reproduction) — L-shape becomes block", () => {
    // L-shape: (0,0), (1,0), (0,1). Dead (1,1) has 3 neighbors → becomes alive
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    const sortKey = (c: [number, number]) => `${c[0]},${c[1]}`;
    expect(result.slice().sort((a, b) => sortKey(a).localeCompare(sortKey(b)))).toEqual(
      [
        [-1, 1],
        [0, 1],
        [1, 1],
      ].sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
    );
  });
  it("handles negative coordinates — blinker shifted into negative space", () => {
    // Vertical blinker at x=-5 → horizontal at y=-4
    const result = nextGeneration([
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ]);
    const sortKey = (c: [number, number]) => `${c[0]},${c[1]}`;
    expect(result.slice().sort((a, b) => sortKey(a).localeCompare(sortKey(b)))).toEqual(
      [
        [-6, -4],
        [-5, -4],
        [-4, -4],
      ].sort((a, b) => sortKey(a).localeCompare(sortKey(b)))
    );
  });
});
