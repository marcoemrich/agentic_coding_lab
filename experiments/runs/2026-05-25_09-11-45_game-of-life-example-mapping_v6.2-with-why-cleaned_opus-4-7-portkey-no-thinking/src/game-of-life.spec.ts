import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty input returns empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die from underpopulation — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged — [(0,0), (1,0), (0,1), (1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("live cell with 4 neighbors dies from overpopulation — center (1,1) of ###/.#./### dies (has 6 live neighbors)", () => {
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 live neighbors becomes alive — ##./#../... → ##./##./...", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("survival: live cell with 2 neighbors lives on — center of row of 3 survives", () => {
    const row: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(row);
    expect(result).toContainEqual([1, 0]);
  });
  it("blinker oscillates: vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.map(c => c.join(",")).sort()).toEqual(expected.map(c => c.join(",")).sort());
  });
  it("handles negative coordinates — vertical blinker at [(-1,0),(-1,-1),(-1,1)] → horizontal at [(-2,0),(-1,0),(0,0)]", () => {
    const vertical: [number, number][] = [[-1, -1], [-1, 0], [-1, 1]];
    const expected: [number, number][] = [[-2, 0], [-1, 0], [0, 0]];
    const result = nextGeneration(vertical);
    expect(result.map(c => c.join(",")).sort()).toEqual(expected.map(c => c.join(",")).sort());
  });
});
