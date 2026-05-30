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
  it("live cell with 2 neighbors survives (rule 2 survival)", () => {
    // Horizontal row: (0,0), (1,0), (2,0). Middle cell (1,0) has 2 live neighbors → survives.
    const next = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(next).toContainEqual([1, 0]);
  });
  it("live cell with 3 neighbors survives (rule 2 survival) — block cell survives", () => {
    // Block: each cell has exactly 3 live neighbors → all survive
    const next = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(next).toContainEqual([0, 0]);
  });
  it("live cell with 4 neighbors dies (overpopulation)", () => {
    // Center (1,1) has 4 diagonal live neighbors: (0,0), (2,0), (0,2), (2,2)
    const next = nextGeneration([[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    // Dead cell (1,1) has live neighbors (0,0), (1,0), (0,1) — exactly 3 → born
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("block still life remains unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(next).toHaveLength(4);
    for (const cell of block) expect(next).toContainEqual(cell);
  });
  it("vertical blinker becomes horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(next).toHaveLength(3);
    for (const cell of expected) expect(next).toContainEqual(cell);
  });
  it("handles negative coordinates correctly", () => {
    // Vertical blinker at negative coords: (-5,-5),(-5,-4),(-5,-3) → horizontal at y=-4
    const next = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(next).toHaveLength(3);
    for (const cell of expected) expect(next).toContainEqual(cell);
  });
});
