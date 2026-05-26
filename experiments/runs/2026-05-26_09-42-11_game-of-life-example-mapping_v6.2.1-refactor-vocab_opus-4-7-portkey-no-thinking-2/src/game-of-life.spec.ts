import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const asCellKeySet = (cells: Cell[]): Set<string> =>
  new Set(cells.map(([x, y]) => `${x},${y}`));

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die from underpopulation — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with exactly 2 neighbors survives (blinker center) — center of vertical blinker survives", () => {
    // vertical blinker [(0,0),(0,1),(0,2)] — center (0,1) has 2 neighbors and survives
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("live cell with 3 neighbors survives — survival T-shape example", () => {
    // T-shape: top row + bottom-center. (1,0) has 3 live neighbors → survives.
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("live cell with 4 neighbors dies from overpopulation — center of full 3x3 dies", () => {
    // full 3x3 grid — center (1,1) has 8 live neighbors → dies
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 neighbors becomes alive — reproduction L-shape (1,1) becomes alive", () => {
    // L-shape: [(0,0),(1,0),(0,1)] — dead cell (1,1) has 3 live neighbors → born
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("blinker oscillates vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(asCellKeySet(result)).toEqual(asCellKeySet([[-1, 1], [0, 1], [1, 1]]));
  });
  it("block is a still life — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(asCellKeySet(result)).toEqual(asCellKeySet(block));
  });
  it("handles negative coordinates correctly", () => {
    // blinker translated by (-10, -10): vertical [(-10,-11),(-10,-10),(-10,-9)] → horizontal
    const result = nextGeneration([[-10, -11], [-10, -10], [-10, -9]]);
    expect(asCellKeySet(result)).toEqual(
      asCellKeySet([[-11, -10], [-10, -10], [-9, -10]]),
    );
  });
});
