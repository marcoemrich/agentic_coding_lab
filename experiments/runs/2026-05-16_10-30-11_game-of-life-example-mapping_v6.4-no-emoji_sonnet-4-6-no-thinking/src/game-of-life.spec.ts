import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two live cells both die from underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with exactly 2 live neighbors survives", () => {
    // Three cells in a row: (0,0), (1,0), (2,0)
    // The center cell (1,0) has 2 neighbors and survives
    // The end cells (0,0) and (2,0) each have 1 neighbor and die
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("live cell with exactly 3 live neighbors survives", () => {
    // Center cell (1,1) has 3 neighbors: (0,1), (1,0), (2,1)
    const result = nextGeneration([[0, 1], [1, 0], [1, 1], [2, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it.todo("live cell with more than 3 live neighbors dies from overpopulation");
  it.todo("dead cell with exactly 3 live neighbors becomes alive");
  it.todo("blinker oscillates between vertical and horizontal");
  it.todo("block still life remains unchanged");
});
