import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";
import { sortCells } from "./test-helpers.js";

describe("Game of Life - Next Generation", () => {
  it("an empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: two adjacent cells both die — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 3 overpopulation: center cell with 4 live neighbors dies — ### / .#. / ### → #.# / #.# / #.#", () => {
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    // Center (1,1) has 4 live neighbors → dies (Rule 3).
    expect(result).not.toContainEqual([1, 1]);
    // Full next generation per the rules (the prompt's 3×3 sketch is
    // illustrative only; cells are also born just outside that window).
    expect(sortCells(result)).toEqual(
      sortCells([
        [0, 0], [2, 0],
        [1, -1], [1, 3],
        [1, 0], [1, 2],
        [0, 2], [2, 2],
      ]),
    );
  });
  it("Rule 4 reproduction: a dead cell with exactly 3 live neighbors becomes alive — (1,1) born from [(0,0),(1,0),(0,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 2 survival: a live cell with 2 live neighbors lives on — (1,0) survives in ### / ... / .#.", () => {
    // Gen 0: (1,0) is alive with exactly 2 live neighbors (0,0) and (2,0).
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("Block still life is unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Blinker oscillates — vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
  it("handles negative coordinates — blinker in negative space [(-5,-5),(-5,-4),(-5,-3)] → [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(sortCells(result)).toEqual(
      sortCells([[-6, -4], [-5, -4], [-4, -4]]),
    );
  });
});
