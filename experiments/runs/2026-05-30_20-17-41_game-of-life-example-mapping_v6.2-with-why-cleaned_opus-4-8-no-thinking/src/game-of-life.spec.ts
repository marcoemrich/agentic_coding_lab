import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("a live cell with 1 neighbor dies (underpopulation) — [(0,1),(1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("a dead cell with exactly 3 neighbors becomes alive (reproduction)", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("a live cell with too many neighbors dies (overpopulation) — center (1,1) of the ### / .#. / ### ring dies", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    const keys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(keys.has("1,1")).toBe(false);
  });
  it("a live cell with 2 neighbors survives (survival) — center (0,1) of vertical triple stays alive", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    const keys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(keys.has("0,1")).toBe(true);
  });
  it("block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] stays the same", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("blinker oscillates — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["-1,1", "0,1", "1,1"]),
    );
  });
  it("handles negative coordinates — blinker in negative space oscillates", () => {
    const result = nextGeneration([
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ]);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(["-6,-4", "-5,-4", "-4,-4"]),
    );
  });
});
