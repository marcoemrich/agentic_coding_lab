import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - next generation", () => {
  it("should return an empty grid for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: should kill two live cells that each have 1 neighbor — [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 survival: should keep a live cell with 3 live neighbors alive — center (1,1) survives", () => {
    // # # #
    // . @ .    @ = the cell under test, with 3 live neighbors
    const tShape: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1]];
    expect(nextGeneration(tShape)).toContainEqual([1, 1]);
  });
  it("Rule 3 overpopulation: should kill a live cell with 4 live neighbors — center (1,1) dies", () => {
    // # # #
    // . @ .    @ = the cell under test, with 4 live neighbors
    // # # #
    const sandwich: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(sandwich)).not.toContainEqual([1, 1]);
  });
  it("Rule 4 reproduction: should bring a dead cell with exactly 3 live neighbors to life — the L completes into a block", () => {
    // # #        # #
    // # .   ->   # #    the empty corner has exactly 3 live neighbors
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(lShape))).toEqual(sorted(block));
  });
  it("Block still life: should leave a 2x2 block unchanged — [(0,0),(1,0),(0,1),(1,1)] -> unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("Blinker: should turn a vertical blinker into a horizontal one — [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(
      sorted([[-1, 1], [0, 1], [1, 1]]),
    );
  });
  it("Blinker: should turn the horizontal blinker back into the vertical one — [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    expect(sorted(nextGeneration([[-1, 1], [0, 1], [1, 1]]))).toEqual(
      sorted([[0, 0], [0, 1], [0, 2]]),
    );
  });
});
