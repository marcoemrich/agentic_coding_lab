import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sorted = (cells: [number, number][]) =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at (0,0), producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each, producing [] (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive (survival)", () => {
    expect(nextGeneration([[0, 0], [1, 1], [2, 2]])).toContainEqual([1, 1]);
  });
  it("keeps the center cell (1,1) with exactly three live neighbors alive (survival example)", () => {
    expect(nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]])).toContainEqual([1, 1]);
  });
  it("kills the center cell (1,1) with more than three live neighbors (overpopulation example)", () => {
    const next = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("creates the dead cell (1,1) with exactly three live neighbors (reproduction example)", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("keeps [(0,0),(1,0),(0,1),(1,1)] unchanged (block still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("turns vertical [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)] (blinker)", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("turns the blinker back to [(0,0),(0,1),(0,2)] after two generations", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(sorted(nextGeneration(nextGeneration(vertical)))).toEqual(sorted(vertical));
  });
});
