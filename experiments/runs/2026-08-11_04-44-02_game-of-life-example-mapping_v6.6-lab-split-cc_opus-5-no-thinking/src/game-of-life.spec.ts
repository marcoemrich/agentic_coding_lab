import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// The spec does not define an output ordering, so full-result comparisons sort
// both sides first. Sorting is value-based, so a missing or extra cell still fails.
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([x, y], [otherX, otherY]) => y - otherY || x - otherX);

// The 2x2 block: every live cell has exactly 3 live neighbours, so the whole
// shape is a still life. Used by both the survival and the still-life tests.
const BLOCK: Cell[] = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
];

// The blinker's two phases. Each is the other's next generation, so both appear
// once as an input and once as an expectation. Safe to share: nextGeneration
// never aliases or mutates its argument.
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

describe("Game of Life - Next Generation", () => {
  it("should return an empty grid for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a single live cell with 0 neighbors (underpopulation) — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill both live cells when each has only 1 neighbor (underpopulation) — [(0,1), (1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  // NOTE: the spec's Rule 2 illustration (`###`/`...`/`.#.` -> `.#.`/`.#.`/`...`)
  // is not reproducible under Conway's rules: its centre (1,1) is dead with 4
  // live neighbours, and the true next generation is [(1,-1),(0,1),(1,0),(2,1)].
  // The spec's *statement* of Rule 2 is sound, so we test that statement using
  // the block, where every live cell has exactly 3 neighbours and survives.
  it("should keep a live cell with 3 live neighbors alive (survival) — (0,0) of the block has 3 neighbors and survives", () => {
    expect(nextGeneration(BLOCK)).toContainEqual([0, 0]);
  });

  // NOTE: as with Rule 2, the spec's Rule 3 illustration is inaccurate. In
  // `###`/`.#.`/`###` the centre (1,1) has 6 live neighbours, not the 4 the
  // prose claims, and the drawn Gen 1 (`#.#`/`#.#`/`#.#`) is not the true next
  // generation. The asserted *behaviour* is nonetheless correct: the centre is
  // overpopulated and dies, so we assert its absence rather than the drawing.
  it("should kill a live cell with 4 live neighbors (overpopulation) — center (1,1) of `###`/`.#.`/`###` dies", () => {
    const grid: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];

    expect(nextGeneration(grid)).not.toContainEqual([1, 1]);
  });

  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction) — (1,1) of `##.`/`#..`/`...` becomes alive", () => {
    const grid: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];

    expect(nextGeneration(grid)).toContainEqual([1, 1]);
  });

  it("should keep a block unchanged (still life) — [(0,0), (1,0), (0,1), (1,1)] -> unchanged", () => {
    expect(sorted(nextGeneration(BLOCK))).toEqual(sorted(BLOCK));
  });

  it("should turn a vertical blinker horizontal — [(0,0), (0,1), (0,2)] -> [(-1,1), (0,1), (1,1)]", () => {
    expect(sorted(nextGeneration(VERTICAL_BLINKER))).toEqual(
      sorted(HORIZONTAL_BLINKER),
    );
  });

  // Asserted as a transition in its own right rather than as
  // nextGeneration(nextGeneration(vertical)): chaining would make a regression in
  // generation 1 fail this test too, hiding which transition actually broke.
  it("should turn the horizontal blinker back to vertical — [(-1,1), (0,1), (1,1)] -> [(0,0), (0,1), (0,2)]", () => {
    expect(sorted(nextGeneration(HORIZONTAL_BLINKER))).toEqual(
      sorted(VERTICAL_BLINKER),
    );
  });

  // Offset entirely into negative space (both axes) rather than reusing
  // HORIZONTAL_BLINKER, which already contains a single negative x — this covers
  // the spec's "infinite in all directions" constraint with coordinates the other
  // tests never reach.
  it("should handle negative coordinates — a blinker at negative coordinates oscillates", () => {
    const vertical: Cell[] = [
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ];
    const horizontal: Cell[] = [
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ];

    expect(sorted(nextGeneration(vertical))).toEqual(sorted(horizontal));
    expect(sorted(nextGeneration(horizontal))).toEqual(sorted(vertical));
  });
});
