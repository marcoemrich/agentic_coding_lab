import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];
const asKeySet = (cells: Cell[]): Set<string> =>
  new Set(cells.map(([x, y]) => `${x},${y}`));

describe("Game of Life - nextGeneration", () => {
  it("single live cell dies — [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells [(0,1),(1,1)] each have 1 neighbor and die — becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 3 Overpopulation: ###/.#./### — center (1,1) has 6 live neighbors and dies", () => {
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(asKeySet(nextGeneration(input)).has("1,1")).toBe(false);
  });
  it("Rule 4 Reproduction: ##./#../... — dead cell (1,1) has 3 live neighbors and becomes alive, yielding the block ##./##.", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    expect(asKeySet(nextGeneration(input))).toEqual(
      asKeySet([[0, 0], [1, 0], [0, 1], [1, 1]])
    );
  });
  it("Rule 2 Survival: ###/.../.#. — live cell (1,0) has 2 live neighbors and survives", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 2]];
    expect(asKeySet(nextGeneration(input)).has("1,0")).toBe(true);
  });
  it("Block still life [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(asKeySet(nextGeneration(input))).toEqual(asKeySet(input));
  });
  it("Blinker vertical [(0,0),(0,1),(0,2)] becomes horizontal [(-1,1),(0,1),(1,1)]", () => {
    const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(asKeySet(nextGeneration(input))).toEqual(
      asKeySet([[-1, 1], [0, 1], [1, 1]])
    );
  });
  it("Blinker horizontal [(-1,1),(0,1),(1,1)] becomes vertical [(0,0),(0,1),(0,2)]", () => {
    const input: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(asKeySet(nextGeneration(input))).toEqual(
      asKeySet([[0, 0], [0, 1], [0, 2]])
    );
  });
  it("handles negative coordinates — single cell at (-5,-5) dies, returns []", () => {
    expect(nextGeneration([[-5, -5]])).toEqual([]);
  });
});
