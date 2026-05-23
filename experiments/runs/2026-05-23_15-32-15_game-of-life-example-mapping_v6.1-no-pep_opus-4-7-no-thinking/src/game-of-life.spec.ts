import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Rule 1 - Underpopulation: single live cell with 0 neighbors dies — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - Underpopulation: two adjacent live cells each with 1 neighbor die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 - Reproduction: dead cell with exactly 3 live neighbors becomes alive — block-corner pattern keeps (0,0),(1,0),(0,1) and adds (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const sorted = [...result].map(c => `${c[0]},${c[1]}`).sort();
    expect(sorted).toEqual(["0,0", "0,1", "1,0", "1,1"]);
  });
  it("Rule 2 - Survival: live cell with 2 live neighbors survives — middle of vertical 3-line (0,1) survives", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const keys = result.map(c => `${c[0]},${c[1]}`);
    expect(keys).toContain("0,1");
  });
  it("Rule 3 - Overpopulation: live cell with more than 3 neighbors dies — center of filled 3x3 dies", () => {
    const filled3x3: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(filled3x3);
    const keys = result.map(c => `${c[0]},${c[1]}`);
    expect(keys).not.toContain("1,1");
  });
  it("Block still life: 2x2 block remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = result.map(c => `${c[0]},${c[1]}`).sort();
    expect(sorted).toEqual(["0,0", "0,1", "1,0", "1,1"]);
  });
  it("Blinker oscillator: vertical [(0,0),(0,1),(0,2)] becomes horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const sorted = result.map(c => `${c[0]},${c[1]}`).sort();
    expect(sorted).toEqual(["-1,1", "0,1", "1,1"]);
  });
  it("handles negative coordinates correctly — block at (-5,-5) stays as a block", () => {
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(block);
    const sorted = result.map(c => `${c[0]},${c[1]}`).sort();
    expect(sorted).toEqual(["-4,-4", "-4,-5", "-5,-4", "-5,-5"]);
  });
});
