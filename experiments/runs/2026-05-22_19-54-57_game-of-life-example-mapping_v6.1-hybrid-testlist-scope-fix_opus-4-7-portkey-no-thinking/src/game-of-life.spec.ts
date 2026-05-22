import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid produces empty next generation — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die from underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with >3 neighbors dies from overpopulation — center (1,1) of ###/.#./### dies", () => {
    const cells: Cell[] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction) — [(0,0),(1,0),(0,1)] produces (1,1) alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same 4 cells", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toEqual(expect.arrayContaining(block));
    expect(result).toHaveLength(4);
  });
  it("vertical blinker becomes horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual(expect.arrayContaining<Cell>([[-1, 1], [0, 1], [1, 1]]));
    expect(result).toHaveLength(3);
  });
  it("rule 2 survival — live cell with 2 neighbors survives (block corner)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toContainEqual([0, 0]);
  });
  it("handles negative coordinates — blinker at (-5,-5..-3) oscillates to (-6..-4,-4)", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toEqual(expect.arrayContaining<Cell>([[-6, -4], [-5, -4], [-4, -4]]));
    expect(result).toHaveLength(3);
  });
});
