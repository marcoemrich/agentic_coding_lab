import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("single cell dies — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells each with 1 neighbor die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive — L-shape (0,0)(1,0)(0,1) → block plus (1,1)", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });
  it("Rule 2 Survival: live cell with 3 neighbors survives — (1,1) alive among row (0,0)(1,0)(2,0) → (1,1) is in next gen", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 Overpopulation: live center with >3 neighbors dies — full 3x3 with (1,1) alive surrounded by 6 → (1,1) absent from next gen", () => {
    const input: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Block still life: 2x2 block remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Blinker oscillator: vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("Handles negative coordinates — vertical blinker at (-5,-5) → horizontal", () => {
    const vertical: Cell[] = [[-5, -6], [-5, -5], [-5, -4]];
    const horizontal: Cell[] = [[-6, -5], [-5, -5], [-4, -5]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
});
