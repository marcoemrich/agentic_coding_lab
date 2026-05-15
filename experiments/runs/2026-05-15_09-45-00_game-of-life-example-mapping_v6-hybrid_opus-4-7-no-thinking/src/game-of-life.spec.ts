import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const toKeys = (cells: [number, number][]): Set<string> =>
  new Set(cells.map(([x, y]) => `${x},${y}`));

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("kills a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center cell (1,1) is surrounded by 4 neighbors (top, bottom, left, right) → dies.
    // Plus-shape input:
    //  .#.
    //  ###
    //  .#.
    const input: [number, number][] = [
      [1, 0],
      [0, 1], [1, 1], [2, 1],
      [1, 2],
    ];
    expect(toKeys(nextGeneration(input)).has("1,1")).toBe(false);
  });
  it("keeps a live cell alive when it has 2 or 3 neighbors (survival)", () => {
    // Cell (0,0) with two neighbors at (1,0) and (0,1) → survives
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    expect(toKeys(nextGeneration(input)).has("0,0")).toBe(true);
  });
  it("revives a dead cell with exactly 3 live neighbors (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1) — dead cell (1,1) has exactly 3 live neighbors
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    expect(toKeys(nextGeneration(input)).has("1,1")).toBe(true);
  });
  it("keeps a block (still life) unchanged across a generation", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(toKeys(nextGeneration(block))).toEqual(toKeys(block));
  });
  it("oscillates a blinker between horizontal and vertical", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const gen1 = nextGeneration(vertical);
    expect(toKeys(gen1)).toEqual(toKeys(horizontal));
    const gen2 = nextGeneration(gen1);
    expect(toKeys(gen2)).toEqual(toKeys(vertical));
  });
});
