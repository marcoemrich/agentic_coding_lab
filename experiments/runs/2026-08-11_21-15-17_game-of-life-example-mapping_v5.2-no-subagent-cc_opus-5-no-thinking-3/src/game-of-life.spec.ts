import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

/** Cells have no guaranteed order, so compare generations as sorted sets. */
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

/**
 * The blinker's two phases. Each generation swaps one for the other, so the
 * two blinker tests below together demonstrate its period-2 oscillation.
 */
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
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: kills two adjacent cells that each have 1 neighbor — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("Rule 4 Reproduction: ##. / #.. / ... → ##. / ##. / ... — dead cell (1,1) with exactly 3 live neighbors is born — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(
      sorted(
        nextGeneration([
          [0, 0],
          [1, 0],
          [0, 1],
        ]),
      ),
    ).toEqual(
      sorted([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    );
  });
  // The spec renders Gen 1 of this grid as `.#. / .#. / ...`, but that is a
  // 3x3-window artifact: on an infinite grid (1,-1) is also born (3 neighbors
  // in the top row), and (0,1)/(2,1) are born rather than (1,1), which has 4.
  it("Rule 2 Survival on an infinite grid: ### / ... / .#. — (1,0) survives on 2 neighbors — [(0,0),(1,0),(2,0),(1,2)] → [(1,0),(1,-1),(0,1),(2,1)]", () => {
    const topRowPlusLoneCell: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 2],
    ];
    const expected: Cell[] = [
      [1, 0],
      [1, -1],
      [0, 1],
      [2, 1],
    ];
    expect(sorted(nextGeneration(topRowPlusLoneCell))).toEqual(sorted(expected));
  });
  // The spec renders Gen 1 as `#.# / #.# / #.#`, but that is both window-clipped
  // and inaccurate: (0,1)/(2,1) have 5 neighbors and die, (1,0)/(1,2) have 3 and
  // survive, and (1,-1)/(1,3) are born outside the 3x3 view. The center (1,1)
  // dies on 6 neighbors, which is what this rule is about.
  it("Rule 3 Overpopulation on an infinite grid: ### / .#. / ### — center (1,1) dies on 6 neighbors — [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] → [(0,0),(1,0),(2,0),(1,-1),(0,2),(1,2),(2,2),(1,3)]", () => {
    const twoRowsAroundCenter: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const expected: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, -1],
      [0, 2],
      [1, 2],
      [2, 2],
      [1, 3],
    ];
    expect(sorted(nextGeneration(twoRowsAroundCenter))).toEqual(
      sorted(expected),
    );
  });
  it("Block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("Blinker oscillates: vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration(VERTICAL_BLINKER))).toEqual(
      sorted(HORIZONTAL_BLINKER),
    );
  });
  it("Blinker oscillates back: horizontal to vertical — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    expect(sorted(nextGeneration(HORIZONTAL_BLINKER))).toEqual(
      sorted(VERTICAL_BLINKER),
    );
  });
  it("handles negative coordinates on the infinite grid — blinker at [(-5,-5),(-5,-4),(-5,-3)] → [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const negativeVerticalBlinker: Cell[] = [
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ];
    const negativeHorizontalBlinker: Cell[] = [
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ];
    expect(sorted(nextGeneration(negativeVerticalBlinker))).toEqual(
      sorted(negativeHorizontalBlinker),
    );
  });
});
