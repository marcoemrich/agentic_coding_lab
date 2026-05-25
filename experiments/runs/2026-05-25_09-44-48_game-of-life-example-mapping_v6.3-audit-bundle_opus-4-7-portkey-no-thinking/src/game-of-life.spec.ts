import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty input returns empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation, 1 neighbor each) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("live cell with 2 neighbors survives (survival) — center of row [(0,1),(1,1),(2,1)] stays alive", () => {
    const row: Cell[] = [[0, 1], [1, 1], [2, 1]];
    const result = nextGeneration(row);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("live cell with more than 3 neighbors dies (overpopulation) — center of filled 3x3 dies", () => {
    const filled: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(filled);
    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("dead cell with exactly 3 neighbors becomes alive (reproduction) — L-shape produces new cell at (1,1)", () => {
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lShape);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("vertical blinker becomes horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]] as Cell[]));
  });
  it("handles negative coordinates — block at negative coords stays unchanged", () => {
    const negBlock: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(negBlock);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(negBlock));
  });
});
