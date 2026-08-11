import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

/** A 2x2 square — the canonical still life. */
const BLOCK: Cell[] = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
];

/** Three cells in a column; oscillates to HORIZONTAL_BLINKER and back. */
const VERTICAL_BLINKER: Cell[] = [
  [0, 0],
  [0, 1],
  [0, 2],
];

const HORIZONTAL_BLINKER: Cell[] = [
  [-1, 1],
  [0, 1],
  [1, 1],
];

/** Three corners of the block; the fourth corner (1,1) is born. */
const L_TRIOMINO: Cell[] = [
  [0, 0],
  [1, 0],
  [0, 1],
];

/** Two full rows with a single cell bridging them, so (1,1) has 6 neighbours. */
const OVERCROWDED_CENTRE: Cell[] = [
  [0, 0],
  [1, 0],
  [2, 0],
  [1, 1],
  [0, 2],
  [1, 2],
  [2, 2],
];

describe("Game of Life - next generation", () => {
  it("keeps an empty grid empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("lets a single live cell die of underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("lets two adjacent cells die, each having only 1 neighbor — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("keeps a live cell with 2 neighbors alive (survival) — [(0,0),(1,0),(2,0)] → contains (1,0)", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
    ).toContainEqual([1, 0]);
  });
  it("kills a live cell with 4 neighbors (overpopulation) — center (1,1) is absent in the next generation", () => {
    expect(nextGeneration(OVERCROWDED_CENTRE)).not.toContainEqual([1, 1]);
  });
  it("brings a dead cell with exactly 3 neighbors to life (reproduction) — [(0,0),(1,0),(0,1)] → contains (1,1)", () => {
    expect(nextGeneration(L_TRIOMINO)).toContainEqual([1, 1]);
  });
  it("keeps a block still life unchanged — [(0,0),(1,0),(0,1),(1,1)] → same 4 cells", () => {
    expect(sorted(nextGeneration(BLOCK))).toEqual(sorted(BLOCK));
  });
  it("oscillates a blinker — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration(VERTICAL_BLINKER))).toEqual(
      sorted(HORIZONTAL_BLINKER),
    );
  });
  it("returns a blinker to its original orientation after two generations — [(0,0),(0,1),(0,2)] → → [(0,0),(0,1),(0,2)]", () => {
    expect(sorted(nextGeneration(nextGeneration(VERTICAL_BLINKER)))).toEqual(
      sorted(VERTICAL_BLINKER),
    );
  });
  it("handles negative coordinates — [(-1,-1),(-1,0),(-1,1)] → [(-2,0),(-1,0),(0,0)]", () => {
    expect(
      sorted(
        nextGeneration([
          [-1, -1],
          [-1, 0],
          [-1, 1],
        ]),
      ),
    ).toEqual(
      sorted([
        [-2, 0],
        [-1, 0],
        [0, 0],
      ]),
    );
  });
  it("Rule 2 example: the cell with 3 live neighbours survives — (1,1) of [(0,0),(1,0),(2,0),(1,1)] lives on", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("Rule 3 example: the overcrowded centre dies while the four corners survive", () => {
    const next = nextGeneration(OVERCROWDED_CENTRE);
    expect(next).not.toContainEqual([1, 1]);
    expect(next).toContainEqual([0, 0]);
    expect(next).toContainEqual([2, 0]);
    expect(next).toContainEqual([0, 2]);
    expect(next).toContainEqual([2, 2]);
  });
  it("Rule 4 example: the L-triomino grows into the block — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration(L_TRIOMINO))).toEqual(sorted(BLOCK));
  });
});
