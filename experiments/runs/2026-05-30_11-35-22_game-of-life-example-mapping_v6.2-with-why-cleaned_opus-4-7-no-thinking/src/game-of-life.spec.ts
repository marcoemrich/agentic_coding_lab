import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid produces empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Rule 1 (Underpopulation): single live cell dies — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 (Underpopulation): two horizontal cells both die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 3 (Overpopulation): center cell with 8 neighbors dies — full 3x3 grid center (1,1) not in output", () => {
    const input: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    const keys = new Set(result.map((c) => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("Rule 4 (Reproduction): dead cell with exactly 3 live neighbors becomes alive — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
  });
  it("Rule 2 (Survival): Block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
  });
  it("Blinker oscillator: vertical becomes horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["-1,1", "0,1", "1,1"])
    );
  });
  it("handles negative coordinates — blinker at negative coordinates oscillates correctly", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(["-6,-4", "-5,-4", "-4,-4"])
    );
  });
});
