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
  it("two adjacent live cells both die from underpopulation — [(0,1), (1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life is unchanged — [(0,0), (1,0), (0,1), (1,1)] -> same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Rule 2 survival: middle of a horizontal row of 3 survives with 2 neighbors — (1,0) present in next gen", () => {
    const row: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(row);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3 overpopulation: center of a plus shape with 4 neighbors dies — (1,1) absent in next gen", () => {
    const plus: Cell[] = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
    const result = nextGeneration(plus);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 reproduction: dead cell with exactly 3 neighbors becomes alive — L-shape produces a block in next gen", () => {
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(lShape))).toEqual(sortCells(expected));
  });
  it("blinker oscillates vertical to horizontal — [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("handles negative coordinates — block at all-negative coordinates is unchanged", () => {
    const negBlock: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(negBlock))).toEqual(sortCells(negBlock));
  });
});
