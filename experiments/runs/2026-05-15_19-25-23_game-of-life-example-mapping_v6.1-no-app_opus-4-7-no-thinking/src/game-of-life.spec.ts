import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const asCellSet = (cells: Cell[]): Set<string> =>
  new Set(cells.map(([x, y]) => `${x},${y}`));

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given an empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell with no neighbors dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("a live cell with only one neighbor dies (underpopulation)", () => {
    // Two adjacent cells: each has exactly 1 neighbor, both die
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("a live cell with two live neighbors survives (survival)", () => {
    // Blinker: vertical line of 3 -> horizontal line of 3
    // Center cell (0,1) has 2 neighbors and survives
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(asCellSet(result)).toEqual(asCellSet([[-1, 1], [0, 1], [1, 1]]));
  });
  it("a live cell with more than three live neighbors dies (overpopulation)", () => {
    // Center (0,0) has 4 live neighbors at (-1,0),(1,0),(0,-1),(0,1) — dies
    const result = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    expect(asCellSet(result).has("0,0")).toBe(false);
  });
  it("a dead cell with exactly three live neighbors becomes alive (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1) — dead (1,1) has 3 neighbors, becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(asCellSet(result).has("1,1")).toBe(true);
  });
  it("blinker oscillates: vertical line becomes horizontal line", () => {
    // After two generations, blinker returns to original state
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(gen0));
    expect(asCellSet(gen2)).toEqual(asCellSet(gen0));
  });
  it("block still life remains unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(asCellSet(result)).toEqual(asCellSet(block));
  });
  it("handles negative coordinates correctly", () => {
    // Blinker shifted to negative coordinates: vertical at x=-10
    const result = nextGeneration([[-10, -1], [-10, 0], [-10, 1]]);
    expect(asCellSet(result)).toEqual(asCellSet([[-11, 0], [-10, 0], [-9, 0]]));
  });
});
