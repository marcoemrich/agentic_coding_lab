import { describe, it, expect } from "vitest";
import { simulate } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty alive cells when given empty alive cells", () => {
    expect(simulate([], 1)).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(simulate([[0, 0]], 1)).toEqual([]);
  });
  it("should return alive cells unchanged when steps is 0", () => {
    expect(simulate([[1, 1], [2, 2]], 0)).toEqual([[1, 1], [2, 2]]);
  });
  it("should keep a block pattern alive (still life with 3 neighbors each)", () => {
    const block = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(simulate(block, 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should bring a dead cell to life when it has exactly 3 alive neighbors", () => {
    // L-shape: dead cell at [1,1] has exactly 3 alive neighbors → born
    expect(simulate([[0, 0], [0, 1], [1, 0]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should evolve a blinker oscillator correctly over multiple steps", () => {
    const horizontalBlinker = [[0, 0], [1, 0], [2, 0]];
    // After 1 step: becomes vertical
    expect(simulate(horizontalBlinker, 1)).toEqual([[1, -1], [1, 0], [1, 1]]);
    // After 2 steps: returns to horizontal
    expect(simulate(horizontalBlinker, 2)).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
  it("should return alive cells sorted lexicographically by x then y", () => {
    // Input in reverse order, steps 0 — output must still be sorted
    expect(simulate([[3, 1], [1, 2], [1, 0], [2, 0]], 0)).toEqual([[1, 0], [1, 2], [2, 0], [3, 1]]);
  });
  it("should read JSON from stdin and write result JSON to stdout via CLI", () => {
    const { execSync } = require("child_process");
    const input = JSON.stringify({ aliveCells: [[0, 0], [1, 0], [2, 0]], steps: 1 });
    const result = execSync(`echo '${input}' | npx tsx src/cli.ts`, { encoding: "utf-8" });
    expect(JSON.parse(result)).toEqual({ aliveCells: [[1, -1], [1, 0], [1, 1]] });
  });
});
