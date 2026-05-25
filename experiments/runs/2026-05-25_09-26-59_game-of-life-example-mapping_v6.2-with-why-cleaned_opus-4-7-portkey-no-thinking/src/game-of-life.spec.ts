import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die from underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(block).map(c => c.join(",")))).toEqual(
      new Set(block.map(c => c.join(",")))
    );
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) — [(0,2),(1,2),(0,1)] includes (1,1) in next gen", () => {
    const input: Array<[number, number]> = [[0, 2], [1, 2], [0, 1]];
    const result = nextGeneration(input);
    const keys = new Set(result.map(c => c.join(",")));
    expect(keys).toEqual(new Set(["0,2", "1,2", "0,1", "1,1"]));
  });
  it("live cell with more than 3 neighbors dies (overpopulation) — center of filled 3x3 dies", () => {
    const filled: Array<[number, number]> = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const keys = new Set(nextGeneration(filled).map(c => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("blinker oscillates vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    const keys = new Set(nextGeneration(vertical).map(c => c.join(",")));
    expect(keys).toEqual(new Set(["-1,1", "0,1", "1,1"]));
  });
  it("handles negative coordinates correctly — horizontal blinker at negative x oscillates", () => {
    const horizontal: Array<[number, number]> = [[-5, 0], [-4, 0], [-3, 0]];
    const keys = new Set(nextGeneration(horizontal).map(c => c.join(",")));
    expect(keys).toEqual(new Set(["-4,-1", "-4,0", "-4,1"]));
  });
});
