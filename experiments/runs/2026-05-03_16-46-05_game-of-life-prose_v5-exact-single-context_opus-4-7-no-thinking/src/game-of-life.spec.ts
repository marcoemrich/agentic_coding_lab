import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("empty grid stays empty", () => {
    expect(nextGeneration(new Set())).toEqual(new Set());
  });
  it("single live cell dies from underpopulation", () => {
    expect(nextGeneration(new Set(["0,0"]))).toEqual(new Set());
  });
  it("two live cells both die from underpopulation", () => {
    expect(nextGeneration(new Set(["0,0", "1,0"]))).toEqual(new Set());
  });
  it("live cell with two live neighbors survives", () => {
    // Three cells in a row; middle cell (1,0) has two live neighbors
    const result = nextGeneration(new Set(["0,0", "1,0", "2,0"]));
    expect(result.has("1,0")).toBe(true);
  });
  it("live cell with three live neighbors survives", () => {
    // 2x2 block: each cell has exactly 3 live neighbors → all survive
    const block = new Set(["0,0", "1,0", "0,1", "1,1"]);
    expect(nextGeneration(block)).toEqual(block);
  });
  it("live cell with four live neighbors dies from overpopulation", () => {
    // Center cell with 4 orthogonal neighbors → 4 live neighbors → dies
    const result = nextGeneration(new Set(["0,0", "1,0", "-1,0", "0,1", "0,-1"]));
    expect(result.has("0,0")).toBe(false);
  });
  it("dead cell with exactly three live neighbors becomes alive", () => {
    // L-shape: dead cell (1,1) has 3 live neighbors → becomes alive
    const result = nextGeneration(new Set(["0,0", "1,0", "0,1"]));
    expect(result.has("1,1")).toBe(true);
  });
  it("blinker oscillates between horizontal and vertical", () => {
    const horizontal = new Set(["0,0", "1,0", "2,0"]);
    const vertical = new Set(["1,-1", "1,0", "1,1"]);
    expect(nextGeneration(horizontal)).toEqual(vertical);
    expect(nextGeneration(vertical)).toEqual(horizontal);
  });
  it("handles negative coordinates", () => {
    // Blinker in negative quadrant
    const horizontal = new Set(["-5,-5", "-4,-5", "-3,-5"]);
    const vertical = new Set(["-4,-6", "-4,-5", "-4,-4"]);
    expect(nextGeneration(horizontal)).toEqual(vertical);
  });
});
