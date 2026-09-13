import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sorted = (cells: [number, number][]): [number, number][] =>
  [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(sorted(nextGeneration([]))).toEqual([]);
  });
  it("kills the single cell at (0,0), producing []", () => {
    expect(sorted(nextGeneration([[0, 0]]))).toEqual([]);
  });
  it("kills the adjacent cells (0,1) and (1,1) through underpopulation, producing []", () => {
    expect(sorted(nextGeneration([[0, 1], [1, 1]]))).toEqual([]);
  });
  it("preserves a live cell with two neighbors: [(0,0),(1,0),(2,0)] becomes [(1,-1),(1,0),(1,1)]", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    expect(sorted(nextGeneration(cells))).toEqual(sorted([[1, -1], [1, 0], [1, 1]]));
  });
  it("preserves a live cell with three neighbors in a T pattern, producing seven specified cells", () => {
    const cells: [number, number][] = [[1, 1], [0, 0], [1, 0], [2, 0]];
    const expected: [number, number][] = [
      [0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [1, -1],
    ];
    expect(sorted(nextGeneration(cells))).toEqual(sorted(expected));
  });
  it("kills a live cell with four neighbors through overpopulation, producing four cardinal cells", () => {
    const cells: [number, number][] = [[0, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]];
    const expected: [number, number][] = [[0, -1], [-1, 0], [1, 0], [0, 1]];
    expect(sorted(nextGeneration(cells))).toEqual(sorted(expected));
  });
  it("reproduces the missing corner from [(0,1),(1,1),(0,0)], producing a block", () => {
    const cells: [number, number][] = [[0, 1], [1, 1], [0, 0]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(cells))).toEqual(sorted(expected));
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)], including a negative coordinate", () => {
    const cells: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(cells))).toEqual(sorted(expected));
  });
  it("turns the blinker back to vertical after two generations", () => {
    const cells: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const afterTwo = nextGeneration(nextGeneration(cells));
    expect(sorted(afterTwo)).toEqual(sorted(cells));
  });
  it("leaves block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(cells))).toEqual(sorted(cells));
  });
});

