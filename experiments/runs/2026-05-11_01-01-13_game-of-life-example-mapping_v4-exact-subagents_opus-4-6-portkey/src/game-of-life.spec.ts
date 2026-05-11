import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    const livingCells = new Set<string>();
    const result = nextGeneration(livingCells);
    expect(result).toEqual(new Set<string>());
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    const livingCells = new Set<string>(["0,0"]);
    const result = nextGeneration(livingCells);
    expect(result).toEqual(new Set<string>());
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    const livingCells = new Set<string>(["0,0", "1,0"]);
    const result = nextGeneration(livingCells);
    expect(result).toEqual(new Set<string>());
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const livingCells = new Set<string>(["0,0", "1,0", "0,1"]);
    const result = nextGeneration(livingCells);
    expect(result).toEqual(new Set<string>(["0,0", "1,0", "0,1", "1,1"]));
  });
  it("should keep a live cell alive when it has exactly 2 live neighbors (survival)", () => {
    const livingCells = new Set<string>(["0,0", "1,0", "2,0"]);
    const result = nextGeneration(livingCells);
    expect(result.has("1,0")).toBe(true);
  });
  it("should keep a live cell alive when it has exactly 3 live neighbors (survival)", () => {
    const livingCells = new Set<string>(["0,0", "1,0", "2,0", "1,1"]);
    const result = nextGeneration(livingCells);
    expect(result.has("1,0")).toBe(true);
  });
  it("should preserve a block still life where each cell has exactly 3 neighbors", () => {
    const livingCells = new Set<string>(["0,0", "1,0", "0,1", "1,1"]);
    const result = nextGeneration(livingCells);
    expect(result).toEqual(new Set<string>(["0,0", "1,0", "0,1", "1,1"]));
  });
  it("should kill a live cell with 4 or more live neighbors (overpopulation)", () => {
    const livingCells = new Set<string>(["1,0", "0,1", "1,1", "2,1", "1,2"]);
    const result = nextGeneration(livingCells);
    expect(result.has("1,1")).toBe(false);
  });
  it("should evolve a blinker from vertical to horizontal orientation", () => {
    const livingCells = new Set<string>(["0,0", "0,1", "0,2"]);
    const result = nextGeneration(livingCells);
    expect(result).toEqual(new Set<string>(["-1,1", "0,1", "1,1"]));
  });
});
