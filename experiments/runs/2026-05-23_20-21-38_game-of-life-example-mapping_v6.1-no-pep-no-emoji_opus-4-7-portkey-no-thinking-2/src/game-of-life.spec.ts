import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation, 0 neighbors) — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (each has 1 neighbor) — [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("live cell with 4+ neighbors dies (overpopulation) — center of full 3x3 dies", () => {
    const fullSquare: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(fullSquare);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) — L-shape produces block", () => {
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expectedBlock: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(lShape);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(expectedBlock));
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(horizontal));
  });
  it("blinker oscillates back from horizontal to vertical — [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(horizontal);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(vertical));
  });
  it("handles negative coordinates — blinker at negative coords oscillates correctly", () => {
    const verticalAtNegative: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const expectedHorizontal: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(verticalAtNegative);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expectedHorizontal));
  });
});
