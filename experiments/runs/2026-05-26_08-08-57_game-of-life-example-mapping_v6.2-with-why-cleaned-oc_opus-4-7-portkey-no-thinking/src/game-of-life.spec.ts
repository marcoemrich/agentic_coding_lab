import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid produces empty next generation -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies from underpopulation -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - two adjacent cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Block still life remains unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(",")))
    );
    expect(result.length).toBe(4);
  });
  it("Rule 2 - cell with 2 or 3 neighbors survives", () => {
    // Block: each cell has exactly 3 neighbors -> survives (already tested)
    // Here: line of 3 cells horizontally; the middle one has 2 neighbors -> survives
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,0")).toBe(true);
  });
  it("Rule 3 - cell with 4 neighbors dies from overpopulation -- center (1,1) dies", () => {
    // Gen 0: ### / .#. / ### => cells without center: (0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)
    // wait, the example shows ### / .#. / ### which includes (1,1) - center is alive with 4 neighbors -> dies
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("Rule 4 - dead cell with exactly 3 neighbors becomes alive -- (1,1) becomes alive", () => {
    // Gen 0: ##. / #.. / ...  => cells [(0,0),(1,0),(0,1)]
    // Dead cell (1,1) has 3 live neighbors -> becomes alive
    // Gen 1: ##. / ##. / ... => cells [(0,0),(1,0),(0,1),(1,1)]
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys).toEqual(new Set(["0,0", "1,0", "0,1", "1,1"]));
  });
  it("Blinker oscillator vertical -> horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys).toEqual(new Set(["-1,1", "0,1", "1,1"]));
  });
  it("Handles negative coordinates correctly", () => {
    // Blinker centered at negative coordinates
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys).toEqual(new Set(["-6,-4", "-5,-4", "-4,-4"]));
  });
});
