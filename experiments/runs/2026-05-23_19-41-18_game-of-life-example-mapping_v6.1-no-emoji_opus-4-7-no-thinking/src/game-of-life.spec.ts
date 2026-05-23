import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty — [] => []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies from underpopulation — [(0,0)] => []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - Underpopulation: two adjacent cells both die (each has 1 neighbor) — [(0,1), (1,1)] => []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 - Survival: cell with 3 neighbors survives — Gen0 [(0,0),(1,0),(2,0),(1,2)] => Gen1 includes (1,0)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3 - Overpopulation: center cell of full 3x3 block dies (8 neighbors) — (1,1) not in result", () => {
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 - Reproduction: dead cell with exactly 3 live neighbors becomes alive — Gen0 [(0,0),(1,0),(0,1)] => Gen1 contains (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life: 2x2 block remains unchanged — [(0,0),(1,0),(0,1),(1,1)] => same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("Blinker oscillator: vertical [(0,0),(0,1),(0,2)] => horizontal [(-1,1),(0,1),(1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    const sortKey = ([x, y]: Cell) => `${x},${y}`;
    expect([...result].sort((a, b) => sortKey(a).localeCompare(sortKey(b))))
      .toEqual([...expected].sort((a, b) => sortKey(a).localeCompare(sortKey(b))));
  });
  it("handles negative coordinates correctly — blinker at negative origin stays a blinker", () => {
    const vertical: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(vertical);
    const sortKey = ([x, y]: Cell) => `${x},${y}`;
    expect([...result].sort((a, b) => sortKey(a).localeCompare(sortKey(b))))
      .toEqual([...expected].sort((a, b) => sortKey(a).localeCompare(sortKey(b))));
  });
});
