import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (Single cell dies) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 Survival: center cell with 2 neighbors lives on", () => {
    // horizontal line ### -> center (1,0) has 2 live neighbors and survives
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const contains = result.some(([x, y]) => x === 1 && y === 0);
    expect(contains).toBe(true);
  });
  it("Rule 3 Overpopulation: center cell with 4 neighbors dies", () => {
    // ### / .#. / ### -> center (1,1) has 4 live neighbors and dies
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    const contains = result.some(([x, y]) => x === 1 && y === 1);
    expect(contains).toBe(false);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    // ## / #. -> dead cell (1,1) has exactly 3 live neighbors and becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const contains = result.some(([x, y]) => x === 1 && y === 1);
    expect(contains).toBe(true);
  });
  it("Block still life is unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("Blinker oscillates -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("Blinker with negative coordinates oscillates back", () => {
    // horizontal blinker (includes negative x) returns to vertical
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
});
