import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single live cell with no neighbors — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 (underpopulation): kills two adjacent cells each having 1 neighbor — [(0,1), (1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  // NOTE: the Rule 2 example in prompt.md is internally inconsistent — its drawn
  // Gen 0 (`###` / `...` / `.#.`) has a DEAD centre with 4 live neighbours, while
  // its caption claims the centre "has 3 live neighbours -> survives". Neither
  // reading yields the stated Gen 1. We therefore test the rule itself: a live
  // cell with exactly 2 live neighbours lives on.
  it("Rule 2 (survival): a live cell with exactly 2 live neighbors lives on — centre of [(0,0), (0,1), (0,2)] survives", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expect(result).toEqual(expect.arrayContaining([[0, 1]]));
  });

  // NOTE: prompt.md's Rule 3 example states Gen 1 = `#.#` / `#.#` / `#.#`, but that
  // is wrong on two counts: (0,1) and (2,1) each have 5 live neighbours so cannot be
  // born, and the drawn 3x3 window clips the births at (1,-1) and (1,3) that an
  // infinite grid must retain. The caption's actual claim — the over-populated centre
  // dies — is what we assert, alongside the verified full next generation.
  it("Rule 3 (overpopulation): the center cell with more than 3 neighbors dies — centre (1,1) of `###`/`.#.`/`###` is not in the next generation", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);

    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
    expect(result).toEqual(
      expect.arrayContaining([
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 2],
        [1, 2],
        [2, 2],
        [1, -1],
        [1, 3],
      ]),
    );
    expect(result).toHaveLength(8);
  });

  it("Rule 4 (reproduction): a dead cell with exactly 3 neighbors becomes alive — [(0,0), (1,0), (0,1)] -> [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(result).toEqual(
      expect.arrayContaining([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    );
    expect(result).toHaveLength(4);
  });

  it("Block (still life) stays unchanged — [(0,0), (1,0), (0,1), (1,1)] -> [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);

    expect(result).toEqual(
      expect.arrayContaining([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    );
    expect(result).toHaveLength(4);
  });

  it("Blinker oscillates from vertical to horizontal — [(0,0), (0,1), (0,2)] -> [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expect(result).toEqual(
      expect.arrayContaining([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
    );
    expect(result).toHaveLength(3);
  });

  it("Blinker oscillates back from horizontal to vertical — [(-1,1), (0,1), (1,1)] -> [(0,0), (0,1), (0,2)]", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);

    expect(result).toEqual(
      expect.arrayContaining([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    );
    expect(result).toHaveLength(3);
  });

  it("handles negative coordinates — blinker at [(-10,-10), (-10,-9), (-10,-8)] -> [(-11,-9), (-10,-9), (-9,-9)]", () => {
    const result = nextGeneration([
      [-10, -10],
      [-10, -9],
      [-10, -8],
    ]);

    expect(result).toEqual(
      expect.arrayContaining([
        [-11, -9],
        [-10, -9],
        [-9, -9],
      ]),
    );
    expect(result).toHaveLength(3);
  });
});
