import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation, 0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation, 1 neighbor each) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 survival: live cell with 2 neighbors lives on (block still life) -- [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("Rule 2 survival: live cell with 3 neighbors lives on (blinker step) -- center [(1,1)] survives, ends die, new cells born above and below", () => {
    // Horizontal blinker [(0,1),(1,1),(2,1)] -> vertical [(1,0),(1,1),(1,2)]
    // Center (1,1) has 2 neighbors -> survives (rule 2)
    const input: [number, number][] = [[0, 1], [1, 1], [2, 1]];
    const result = nextGeneration(input);
    expect(result.sort()).toEqual([[1, 0], [1, 1], [1, 2]].sort());
  });
  it("Rule 3 overpopulation: live cell with > 3 neighbors dies -- center (1,1) of 8-around-1 pattern dies", () => {
    // Spec example: ### / .#. / ### -> center (1,1) has 6 neighbors -> dies
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 reproduction: dead cell with exactly 3 neighbors becomes alive -- L-shape [(0,0),(1,0),(0,1)] -> block [(0,0),(1,0),(0,1),(1,1)]", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });
  it("Blinker oscillator: vertical [(0,0),(0,1),(0,2)] -> horizontal [(-1,1),(0,1),(1,1)]", () => {
    const input: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(input);
    expect(result.sort()).toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });
  it("Handles negative coordinates -- vertical blinker at x=-5 oscillates to horizontal", () => {
    // Vertical blinker at [(-5,-10),(-5,-9),(-5,-8)]
    // Should become horizontal [(-6,-9),(-5,-9),(-4,-9)]
    const input: [number, number][] = [[-5, -10], [-5, -9], [-5, -8]];
    const result = nextGeneration(input);
    expect(result.sort()).toEqual([[-6, -9], [-5, -9], [-4, -9]].sort());
  });
});
