import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty: [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation): [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells [(0,1),(1,1)] each have 1 neighbor → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 Reproduction example: [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
    expect(result).toHaveLength(4);
  });
  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] → unchanged", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
    expect(result).toHaveLength(4);
  });
  it("Rule 2 Survival: live cell with 2 neighbors survives — (1,0) with neighbors (0,0),(2,0) survives", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    const keys = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(keys.has("1,0")).toBe(true);
  });
  it("Rule 3 Overpopulation: center (1,1) surrounded by 8 live neighbors dies", () => {
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    const keys = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(keys.has("1,1")).toBe(false);
  });
  it("Blinker oscillator Gen 0 → Gen 1: [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`))).toEqual(
      new Set(["-1,1", "0,1", "1,1"])
    );
    expect(result).toHaveLength(3);
  });
  it("Blinker oscillator Gen 1 → Gen 2: [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`))).toEqual(
      new Set(["0,0", "0,1", "0,2"])
    );
    expect(result).toHaveLength(3);
  });
});
