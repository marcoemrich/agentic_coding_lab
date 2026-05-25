import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - nextGeneration", () => {
  // Simplest case
  it("should return empty array when input is empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Single cell dies example
  it("should kill a single live cell with 0 neighbors (single cell dies example) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation example: two horizontal cells each with 1 neighbor die
  it("should kill both cells when two adjacent cells each have only 1 neighbor (Rule 1 underpopulation) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 - Survival: a live cell with 2 live neighbors survives.
  // Use an L-tromino: (0,0),(1,0),(0,1). The corner (0,0) has 2 neighbors -> survives.
  it("should keep a live cell alive when it has 2 live neighbors (Rule 2 survival) -- (0,0) in L-tromino survives", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([0, 0]);
  });

  // Rule 3 - Overpopulation: a live cell with > 3 neighbors dies.
  // Spec example uses 3x3 minus left/right of center, where center (1,1) has 6 neighbors (>3 -> dies)
  it("should kill center cell when it has more than 3 live neighbors (Rule 3 overpopulation) -- (1,1) dies in 3x3-minus-sides pattern", () => {
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Rule 4 - Reproduction example: dead cell (1,1) with exactly 3 neighbors becomes alive
  it("should bring a dead cell to life when it has exactly 3 live neighbors (Rule 4 reproduction) -- [(0,2),(1,2),(0,1)] produces (1,1) alive", () => {
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Block still life pattern
  it("should keep a 2x2 block unchanged (Block still life) -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  // Blinker pattern - vertical to horizontal
  it("should oscillate vertical blinker to horizontal (Blinker Gen0->Gen1) -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });

  // Blinker pattern - horizontal back to vertical
  it("should oscillate horizontal blinker back to vertical (Blinker Gen1->Gen2) -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sortCells(nextGeneration(horizontal))).toEqual(sortCells(vertical));
  });

  // Negative coordinates support
  it("should handle negative coordinates correctly -- blinker at negative coords works", () => {
    // Vertical blinker centered at (-10, -10): cells (-10,-11),(-10,-10),(-10,-9)
    const vertical: Cell[] = [[-10, -11], [-10, -10], [-10, -9]];
    const horizontal: Cell[] = [[-11, -10], [-10, -10], [-9, -10]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
});
