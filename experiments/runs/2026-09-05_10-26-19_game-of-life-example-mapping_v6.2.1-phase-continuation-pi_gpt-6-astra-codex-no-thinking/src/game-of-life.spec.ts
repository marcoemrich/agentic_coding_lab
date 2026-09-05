import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("keeps an empty grid empty: [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single cell: [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills cells with one neighbor: [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("preserves a live cell with two neighbors", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toContainEqual([0, 1]);
  });
  it("preserves a live center (1,1) with three neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]))
      .toContainEqual([1, 1]);
  });
  it("kills a live center (1,1) with four neighbors", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]))
      .not.toContainEqual([1, 1]);
  });
  it("kills the center of the seven-cell overpopulation diagram with six neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]))
      .not.toContainEqual([1, 1]);
  });
  it("births (1,1) from three neighbors: L shape -> block", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("does not birth a dead cell with fewer than three neighbors", () => {
    for (const cells of [[], [[0, 0]], [[0, 0], [1, 0]]] as [number, number][][]) {
      expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
    }
  });
  it("does not birth a dead cell with more than three neighbors", () => {
    const neighbors: [number, number][] = [
      [0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2],
    ];
    for (let count = 4; count <= 8; count++) {
      expect(nextGeneration(neighbors.slice(0, count))).not.toContainEqual([1, 1]);
    }
  });
  it("keeps the block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("returns a blinker to its original cells after two generations", () => {
    const blinker: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(nextGeneration(blinker));
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(blinker));
  });
  it("evolves sparse patterns at large positive and negative x/y coordinates", () => {
    const cells: [number, number][] = [];
    const expected: [number, number][] = [];
    for (const x of [-1_000_000_000, 1_000_000_000]) {
      for (const y of [-1_000_000_000, 1_000_000_000]) {
        cells.push([x, y - 1], [x, y], [x, y + 1]);
        expected.push([x - 1, y], [x, y], [x + 1, y]);
      }
    }
    const result = nextGeneration(cells);
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
