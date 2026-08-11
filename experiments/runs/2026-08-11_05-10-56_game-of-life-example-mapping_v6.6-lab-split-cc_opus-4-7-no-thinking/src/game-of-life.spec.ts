import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("single cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells die from underpopulation — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life survives unchanged — [(0,0), (1,0), (0,1), (1,1)] → same", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(cells);
    expect(result.sort()).toEqual(cells.sort());
  });
  it("live cell with 2 neighbors survives (rule 2)", () => {
    // diagonal: (0,0), (1,1), (2,2) — middle (1,1) has 2 neighbors
    const result = nextGeneration([[0, 0], [1, 1], [2, 2]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("live cell with 3 neighbors survives (rule 2) — center of row+cell pattern survives", () => {
    // (0,0),(1,0),(2,0) row + (1,1) alive. Cell (1,1) has 3 live neighbors (0,0),(1,0),(2,0).
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("live cell with 4 neighbors dies from overpopulation (rule 3)", () => {
    // Center (1,1) with 4 diagonal neighbors: (0,0),(2,0),(0,2),(2,2)
    const result = nextGeneration([[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 neighbors becomes alive (rule 4) — L-shape produces (1,1)", () => {
    // ##. / #.. / ... → dead (1,1) has neighbors (0,0),(1,0),(0,1) = 3 → born
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("blinker oscillates — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const sortKey = ([x, y]: Cell) => `${x},${y}`;
    expect([...result].sort((a, b) => sortKey(a).localeCompare(sortKey(b)))).toEqual(
      [[-1, 1], [0, 1], [1, 1]].sort((a, b) => sortKey(a as Cell).localeCompare(sortKey(b as Cell))),
    );
  });
  it("handles negative coordinates correctly", () => {
    // Blinker at negative x: (-5,-5),(-5,-4),(-5,-3) → (-6,-4),(-5,-4),(-4,-4)
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    const sortKey = ([x, y]: Cell) => `${x},${y}`;
    expect([...result].sort((a, b) => sortKey(a).localeCompare(sortKey(b)))).toEqual(
      [[-6, -4], [-5, -4], [-4, -4]].sort((a, b) => sortKey(a as Cell).localeCompare(sortKey(b as Cell))),
    );
  });
});
