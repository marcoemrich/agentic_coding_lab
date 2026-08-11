import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// The API contract fixes no output ordering, so full-result assertions compare
// cells as an unordered set. Tests that pin a single rule assert containment
// instead — the spec's per-rule ASCII pictures disagree with its own rules on
// the cells those examples do not highlight.
const asCellSet = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

// The blinker's two phases, from the spec's coordinate example. Shared because
// the oscillation tests read them in both directions.
const VERTICAL_BLINKER: Cell[] = [[0, 0], [0, 1], [0, 2]];
const HORIZONTAL_BLINKER: Cell[] = [[-1, 1], [0, 1], [1, 1]];

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Rule 1 (underpopulation): a single live cell [(0,0)] dies — []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 (underpopulation): two adjacent cells [(0,1),(1,1)] each with 1 neighbor die — []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 (survival): cell (1,0) with 2 live neighbors in [(0,0),(1,0),(2,0),(1,2)] lives on", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]])).toContainEqual([
      1, 0,
    ]);
  });
  it("Rule 3 (overpopulation): center cell (1,1) with more than 3 live neighbors in the ### / .#. / ### grid dies", () => {
    const grid: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    expect(nextGeneration(grid)).not.toContainEqual([1, 1]);
  });
  it("Rule 4 (reproduction): dead cell (1,1) with exactly 3 live neighbors from [(0,0),(1,0),(0,1)] becomes alive — [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(asCellSet(result)).toEqual(asCellSet([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("Block still life [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(asCellSet(nextGeneration(block))).toEqual(asCellSet(block));
  });
  it("Blinker [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    expect(asCellSet(nextGeneration(VERTICAL_BLINKER))).toEqual(
      asCellSet(HORIZONTAL_BLINKER),
    );
  });
  it("Blinker oscillates back: [(-1,1),(0,1),(1,1)] becomes [(0,0),(0,1),(0,2)]", () => {
    expect(asCellSet(nextGeneration(HORIZONTAL_BLINKER))).toEqual(
      asCellSet(VERTICAL_BLINKER),
    );
  });
  it("handles negative coordinates: block [(-1,-1),(0,-1),(-1,0),(0,0)] stays unchanged", () => {
    const blockInNegativeQuadrant: Cell[] = [
      [-1, -1],
      [0, -1],
      [-1, 0],
      [0, 0],
    ];
    expect(asCellSet(nextGeneration(blockInNegativeQuadrant))).toEqual(
      asCellSet(blockInNegativeQuadrant),
    );
  });
});
