import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) unchanged as still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`))).toEqual(
      new Set(block.map(c => `${c[0]},${c[1]}`))
    );
  });
  it("should oscillate a blinker from vertical to horizontal", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal = new Set(["-1,1", "0,1", "1,1"]);
    const result = nextGeneration(vertical);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`))).toEqual(horizontal);
  });
  it("should bring a dead cell to life with exactly 3 neighbors (reproduction)", () => {
    const lTromino: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lTromino);
    const keys = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(keys.has("1,1")).toBe(true);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    const filled3x3: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(filled3x3);
    const keys = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(keys.has("1,1")).toBe(false);
  });
  it("should handle negative coordinates correctly", () => {
    const blinker: Cell[] = [[-5, -1], [-5, 0], [-5, 1]];
    const result = nextGeneration(blinker);
    const keys = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(keys).toEqual(new Set(["-6,0", "-5,0", "-4,0"]));
  });
});
