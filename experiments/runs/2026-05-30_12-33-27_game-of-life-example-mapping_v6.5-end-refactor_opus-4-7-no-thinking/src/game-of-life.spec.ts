import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation, 0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - Underpopulation: two adjacent cells both die (each has 1 neighbor) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 - Survival: live cell with 2 neighbors survives — middle of 3-in-a-row stays alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3 - Overpopulation: center cell with 4 neighbors dies — plus shape center (1,1) dies", () => {
    const result = nextGeneration([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 - Reproduction: dead cell with exactly 3 live neighbors becomes alive — L shape produces (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block (still life) stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("Blinker oscillates vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining<Cell>([[-1, 1], [0, 1], [1, 1]]));
  });
  it("Blinker oscillates back horizontal → vertical — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining<Cell>([[0, 0], [0, 1], [0, 2]]));
  });
  it("handles negative coordinates correctly — blinker centered at (-5,-4)", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining<Cell>([[-6, -4], [-5, -4], [-4, -4]]));
  });
});
