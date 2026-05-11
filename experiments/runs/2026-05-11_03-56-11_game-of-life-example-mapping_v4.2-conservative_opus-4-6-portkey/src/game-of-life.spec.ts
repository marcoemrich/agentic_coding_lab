import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });
  it("should keep a cell alive that has exactly 2 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const sorted = result.map(c => c.join(",")).sort();
    expect(sorted).toEqual(["1,-1", "1,0", "1,1"]);
  });
  it("should keep a cell alive that has exactly 3 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 1], [1, 0], [1, 1], [1, 2]]);
    const sorted = result.map(c => c.join(",")).sort();
    expect(sorted).toEqual(["0,0", "0,1", "0,2", "1,0", "1,1", "1,2", "2,1"]);
  });
  it("should kill a cell that has 4 or more live neighbors (overpopulation)", () => {
    // Plus/cross shape: center (1,1) has 4 live neighbors → dies
    const input: [number, number][] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(input);
    const sorted = result.map(c => c.join(",")).sort();
    // (1,1) should be dead (overpopulation with 4 neighbors)
    expect(sorted).not.toContain("1,1");
    // Full expected output: corners born, arms survive, center dies
    expect(sorted).toEqual(["0,0", "0,1", "0,2", "1,0", "1,2", "2,0", "2,1", "2,2"]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // Gen 0: L-shape — (0,1), (0,2), (1,2)
    // Dead cell (1,1) has 3 live neighbors → born
    const result = nextGeneration([[0, 1], [0, 2], [1, 2]]);
    const sorted = result.map(c => c.join(",")).sort();
    expect(sorted).toEqual(["0,1", "0,2", "1,1", "1,2"]);
  });
  it("should leave a block pattern unchanged as a still life", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = result.map(c => c.join(",")).sort();
    expect(sorted).toEqual(["0,0", "0,1", "1,0", "1,1"]);
  });
  it("should oscillate a blinker pattern to its alternate phase", () => {
    // Gen 0: vertical blinker
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];

    // Gen 1: horizontal blinker
    const gen1 = nextGeneration(gen0);
    const sortedGen1 = gen1.map(c => c.join(",")).sort();
    expect(sortedGen1).toEqual(["-1,1", "0,1", "1,1"]);

    // Gen 2: back to vertical (same as gen0)
    const gen2 = nextGeneration(gen1);
    const sortedGen2 = gen2.map(c => c.join(",")).sort();
    expect(sortedGen2).toEqual(["0,0", "0,1", "0,2"]);
  });
});
