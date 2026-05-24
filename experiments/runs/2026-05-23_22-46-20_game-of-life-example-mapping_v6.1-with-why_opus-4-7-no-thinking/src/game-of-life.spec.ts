import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];
const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Rule 1 (Underpopulation): single live cell at (0,0) dies → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 (Underpopulation): two adjacent cells [(0,1),(1,1)] both die (each has 1 neighbor) → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] stays unchanged (Rule 2 survival with 3 neighbors each)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Rule 4 (Reproduction): L-shape [(0,0),(1,0),(0,1)] produces block including (1,1)", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });
  it("Blinker (oscillator): vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("Rule 3 (Overpopulation): center cell (1,1) with 4 live neighbors dies → next gen excludes (1,1)", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]];
    const result = nextGeneration(input);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("Should handle negative coordinates (vertical blinker at negative y rotates correctly)", () => {
    const vertical: Cell[] = [[0, -2], [0, -1], [0, 0]];
    const horizontal: Cell[] = [[-1, -1], [0, -1], [1, -1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
});
