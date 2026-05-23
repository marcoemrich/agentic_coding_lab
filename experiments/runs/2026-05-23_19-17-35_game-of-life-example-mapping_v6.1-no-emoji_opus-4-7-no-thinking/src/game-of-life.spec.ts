import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - two adjacent cells both die from underpopulation — [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 3 - live cell with 4 neighbors dies from overpopulation — center of filled 3x3 dies", () => {
    const filled3x3: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(filled3x3);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 - dead cell with exactly 3 live neighbors becomes alive — L-shape produces (1,1)", () => {
    const lShape: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const result = nextGeneration(lShape);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 2 - live cell with 2 neighbors survives — blinker center (0,1) survives", () => {
    const verticalBlinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(verticalBlinker);
    expect(result).toContainEqual([0, 1]);
  });
  it("Block still life is stable — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Blinker oscillates vertical to horizontal — [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const verticalBlinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontalBlinker: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(verticalBlinker))).toEqual(sortCells(horizontalBlinker));
  });
  it("handles negative coordinates — block at negative coords unchanged", () => {
    const negativeBlock: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(negativeBlock))).toEqual(sortCells(negativeBlock));
  });
});
