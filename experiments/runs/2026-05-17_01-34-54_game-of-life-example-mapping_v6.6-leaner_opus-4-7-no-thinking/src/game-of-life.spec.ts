import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should keep a block (still life) unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`)))
      .toEqual(new Set(block.map(c => `${c[0]},${c[1]}`)));
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`)))
      .toEqual(new Set(["-1,1", "0,1", "1,1"]));
  });
  it("should birth a dead cell with exactly 3 live neighbors", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`)))
      .toEqual(new Set(["0,0", "1,0", "0,1", "1,1"]));
  });
  it("should handle negative coordinates", () => {
    const input: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const result = nextGeneration(input);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`)))
      .toEqual(new Set(["-6,-4", "-5,-4", "-4,-4"]));
  });
});
