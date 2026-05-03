import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty set when given empty set", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    const result = nextGeneration(new Set(["0,0"]));
    expect(result).toEqual(new Set());
  });
  it("should kill a live cell with only one live neighbor (underpopulation)", () => {
    const result = nextGeneration(new Set(["0,0", "1,0"]));
    expect(result).toEqual(new Set());
  });
  it("should keep a live cell alive with two live neighbors", () => {
    // (0,0) has live neighbors (1,0) and (0,1) -> survives
    const result = nextGeneration(new Set(["0,0", "1,0", "0,1"]));
    expect(result.has("0,0")).toBe(true);
  });
  it("should keep a live cell alive with three live neighbors", () => {
    // 2x2 block: each cell has exactly 3 live neighbors
    const result = nextGeneration(new Set(["0,0", "1,0", "0,1", "1,1"]));
    expect(result.has("0,0")).toBe(true);
  });
  it("should kill a live cell with four live neighbors (overpopulation)", () => {
    // Center (0,0) has 4 live neighbors: (1,0), (-1,0), (0,1), (0,-1) -> dies
    const result = nextGeneration(new Set(["0,0", "1,0", "-1,0", "0,1", "0,-1"]));
    expect(result.has("0,0")).toBe(false);
  });
  it("should bring a dead cell to life with exactly three live neighbors (reproduction)", () => {
    // Dead cell (1,1) has 3 live neighbors: (0,0), (1,0), (0,1) -> becomes alive
    const result = nextGeneration(new Set(["0,0", "1,0", "0,1"]));
    expect(result.has("1,1")).toBe(true);
  });
  it("should handle negative coordinates correctly", () => {
    // Block in negative coords: 2x2 at (-5,-5), (-4,-5), (-5,-4), (-4,-4)
    // All cells stay alive (each has 3 neighbors)
    const result = nextGeneration(new Set(["-5,-5", "-4,-5", "-5,-4", "-4,-4"]));
    expect(result).toEqual(new Set(["-5,-5", "-4,-5", "-5,-4", "-4,-4"]));
  });
  it("should produce correct next generation for a blinker oscillator", () => {
    // Horizontal blinker -> vertical blinker
    const result = nextGeneration(new Set(["-1,0", "0,0", "1,0"]));
    expect(result).toEqual(new Set(["0,-1", "0,0", "0,1"]));
  });
});
