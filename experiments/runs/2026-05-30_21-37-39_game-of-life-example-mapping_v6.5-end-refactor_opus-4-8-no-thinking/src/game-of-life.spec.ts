import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns an empty array for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: two cells each with 1 neighbor die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 reproduction: a dead cell with exactly 3 live neighbors becomes alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(
      expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
  it("Rule 2 survival: a live cell with 2 live neighbors lives on", () => {
    // Three in a row: only the middle cell has 2 live neighbors and survives.
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toEqual(expect.arrayContaining([[1, 0]]));
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3 overpopulation: a live cell with more than 3 live neighbors dies", () => {
    // ### / .#. / ### — the center (1,1) has 6 live neighbors → dies.
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("Blinker oscillator: vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]),
    );
  });
  it("handles negative coordinates", () => {
    // A vertical blinker entirely in negative space oscillates to horizontal.
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([[-6, -4], [-5, -4], [-4, -4]]),
    );
  });
});
