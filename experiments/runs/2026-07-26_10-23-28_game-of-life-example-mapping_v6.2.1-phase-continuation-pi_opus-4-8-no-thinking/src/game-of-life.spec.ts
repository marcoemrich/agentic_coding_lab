import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Rule 1 - single live cell (0 neighbors) dies -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - underpopulation: two adjacent cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 - survival: live cell with 3 neighbors lives on", () => {
    // (1,1) is alive with neighbors (0,0),(1,0),(2,0) -> 3 neighbors -> survives
    const result = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 - overpopulation: center cell with 4 neighbors dies", () => {
    // (1,1) alive with 4 neighbors (0,0),(1,0),(2,0),(0,2) -> dies
    const result = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 - reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    // (1,1) dead with neighbors (0,0),(1,0),(2,0) -> becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life stays unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("Blinker oscillator vertical -> horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    for (const cell of [[-1, 1], [0, 1], [1, 1]] as [number, number][]) {
      expect(result).toContainEqual(cell);
    }
  });
  it("Blinker oscillator returns to vertical after 2 generations", () => {
    const gen1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const gen2 = nextGeneration(gen1);
    expect(gen2).toHaveLength(3);
    for (const cell of [[0, 0], [0, 1], [0, 2]] as [number, number][]) {
      expect(gen2).toContainEqual(cell);
    }
  });
});
