import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die from underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("live cell with 4 neighbors dies from overpopulation (rule 3 center cell)", () => {
    // Gen 0: top row + center + bottom row → center (1,1) has 4 neighbors → dies
    const input: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 neighbors becomes alive (rule 4 reproduction)", () => {
    // Gen 0: (0,0), (1,0), (0,1). Dead cell (1,1) has 3 live neighbors → born
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("rule 2 survival example — live cell with 2 neighbors survives", () => {
    // Three-in-a-row: center cell (1,0) has 2 live neighbors → survives
    const input: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 0]);
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]] as Cell[]));
  });
});
