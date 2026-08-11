import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// A generation is a set of positions, not a sequence: nextGeneration makes no
// promise about ordering. `arrayContaining` alone would pass on extra cells, so
// the length check is what makes this an equality rather than a subset test.
const expectSameCells = (actual: Cell[], expected: Cell[]): void => {
  expect(actual).toEqual(expect.arrayContaining(expected));
  expect(actual).toHaveLength(expected.length);
};

describe("Game of Life - nextGeneration", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("Rule 1 (underpopulation): a single live cell with 0 neighbors dies — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 (underpopulation): two adjacent live cells each with 1 neighbor die — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("Rule 2 (survival): a live cell with 2 live neighbors lives on — blinker [(0,0), (0,1), (0,2)] keeps (0,1) alive", () => {
    expect(
      nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    ).toContainEqual([0, 1]);
  });

  // NOTE: the spec's Rule 2 illustration (### / ... / .#. → .#. / .#. / ...) is
  // internally inconsistent: in its own Gen 0 drawing the cell (1,1) is dead and
  // has 4 neighbors, not the 3 the prose claims, and the drawn Gen 1 is not what
  // Conway's rules produce from the drawn Gen 0. The 3-neighbor survival branch is
  // therefore pinned here with an unambiguous configuration — in a 2x2 block every
  // live cell has exactly 3 live neighbors and survives.
  it("Rule 2 (survival): a live cell with 3 live neighbors lives on — (0,0) in a 2x2 block has 3 neighbors and survives", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    ).toContainEqual([0, 0]);
  });

  // NOTE: like the Rule 2 illustration, the spec's Rule 3 drawing
  // (### / .#. / ### → #.# / #.# / #.#) is internally inconsistent. In its own
  // Gen 0 the center (1,1) has SIX live neighbors, not the 4 the prose claims,
  // and the true next generation spills to y=-1 and y=3 rather than being the
  // drawn 3x3. The rule itself is sound and is what gets pinned here: (1,1) is
  // alive with more than 3 neighbors, so it dies.
  it("Rule 3 (overpopulation): a live cell with more than 3 live neighbors dies — center of ### / .#. / ### has 6 and dies", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ]),
    ).not.toContainEqual([1, 1]);
  });

  it("Rule 4 (reproduction): a dead cell with exactly 3 live neighbors becomes alive — ##. / #.. / ... → ##. / ##. / ...", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expectSameCells(result, [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("handles negative coordinates — blinker [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expectSameCells(result, [
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });

  it("block still life stays unchanged — [(0,0), (1,0), (0,1), (1,1)] → same four cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    const result = nextGeneration(block);

    expectSameCells(result, block);
  });

  it("blinker oscillates back to vertical after two generations — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const vertical: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const horizontal = nextGeneration(vertical);
    expectSameCells(horizontal, [
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);

    expectSameCells(nextGeneration(horizontal), vertical);
  });

  // Rule 4 says EXACTLY 3 neighbors, so the upper bound needs its own test:
  // without this, `isBorn` could be `>= 3` and every other test would still pass.
  it("Rule 4 (reproduction): a dead cell with more than 3 live neighbors is NOT born — 4 diagonal corners around (1,1) → []", () => {
    expect(
      nextGeneration([
        [0, 0],
        [2, 0],
        [0, 2],
        [2, 2],
      ]),
    ).toEqual([]);
  });

  // Rule 3's boundary: the ###/.#./### fixture above has SIX neighbors, which only
  // rules out a survival cap of 6+. Exactly 4 is the first count that must die, so
  // without this test MAX_NEIGHBORS_TO_SURVIVE could be 4 or 5 and stay green.
  it("Rule 3 (overpopulation): a live cell with exactly 4 live neighbors dies — centre of the diagonal cross dies (its four edge cells are born)", () => {
    const result = nextGeneration([
      [1, 1],
      [0, 0],
      [2, 0],
      [0, 2],
      [2, 2],
    ]);

    expect(result).not.toContainEqual([1, 1]);
    expectSameCells(result, [
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 1],
    ]);
  });
});
