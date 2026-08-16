import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sorted = (cells: [number, number][]) =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it.todo("kills a single live cell at [(0,0)] by underpopulation -- returns []");
  it.todo("kills two adjacent cells at [(0,1),(1,1)] with one neighbor each -- returns []");
  it.todo("keeps live cells with two neighbors alive");
  it.todo("keeps a live cell with three neighbors alive");
  it.todo("kills a live cell with more than three neighbors");
  it.todo("reproduces a dead cell with exactly three neighbors -- [(0,0),(1,0),(0,1)] becomes a 2x2 block");
  it.todo("oscillates a blinker across two generations, including negative coordinates");
  it.todo("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged");
});
