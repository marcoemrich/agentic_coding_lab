import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("returns empty for empty input — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation: pair each with 1 neighbor dies — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("survival: live cell with 2 neighbors lives on — center of vertical triple survives", () => {
    // Vertical triple: center (1,1) has 2 live neighbors → survives
    const result = nextGeneration([[1, 0], [1, 1], [1, 2]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("overpopulation: live cell with >3 neighbors dies — center with 4 neighbors removed", () => {
    // Center (1,1) has 4 orthogonal live neighbors → overpopulation → dies
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("reproduction: dead cell with exactly 3 neighbors becomes alive — (1,1) born", () => {
    // Dead cell (1,1) has 3 live neighbors (0,0),(1,0),(0,1) → born
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(sortCells(result)).toEqual(sortCells(block));
  });
  it("blinker oscillates — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen1));
  });
  it("handles negative coordinates — block in negative space is unchanged", () => {
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
});
