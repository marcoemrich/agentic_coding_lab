import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with 0 neighbors (underpopulation) — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells each with 1 neighbor (underpopulation) — [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell alive with 2 neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("keeps a live cell alive with 3 neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
  });
  it("kills a live cell with 4 neighbors (overpopulation)", () => {
    const result = nextGeneration([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("revives a dead cell with exactly 3 live neighbors (reproduction) — Rule 4 example", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result.map(c => c.join(",")).sort()).toEqual(["0,0", "0,1", "1,0", "1,1"]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(cells);
    expect(result.sort()).toEqual(cells.sort());
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.map(c => c.join(",")).sort()).toEqual(["-1,1", "0,1", "1,1"]);
  });
  it("handles negative coordinates correctly", () => {
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(block);
    expect(result.map(c => c.join(",")).sort()).toEqual(block.map(c => c.join(",")).sort());
  });
});
