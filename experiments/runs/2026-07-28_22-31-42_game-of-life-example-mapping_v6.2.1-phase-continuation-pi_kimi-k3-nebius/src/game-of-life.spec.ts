import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

/** Sort cells so assertions are independent of output ordering. */
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);

describe("Game of Life - nextGeneration", () => {
  it("single cell dies -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: live cells with fewer than 2 live neighbors die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 survival: live cell with 3 live neighbors survives -- center (1,1) survives", () => {
    // T-tetromino: (1,1) is alive with exactly 3 live neighbors
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 overpopulation: live cell with 4 live neighbors dies -- center (1,1) dies", () => {
    // X-pattern: (1,1) is alive with exactly 4 live neighbors
    const result = nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 reproduction: dead cell with exactly 3 live neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sorted(result)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("Block still life remains unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("Blinker oscillates from vertical to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sorted(result)).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("Blinker returns to original after two generations -- [(0,0),(0,1),(0,2)] -> ... -> [(0,0),(0,1),(0,2)]", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(gen0));
    expect(sorted(gen2)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
});
