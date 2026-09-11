import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}

describe("Game of Life - Next Generation", () => {
  it("returns [] for an empty input (no living cells)", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("single cell dies — [(0,0)] has 0 neighbors → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it(
    "Rule 4 (Reproduction) — [(0,0),(1,0),(0,1)], dead cell (1,1) has exactly 3 live neighbors → becomes alive, survivors keep living → [(0,0),(1,0),(0,1),(1,1)]",
    () => {
      const result = nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]);
      expect(sortCells(result)).toEqual(
        sortCells([
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ]),
      );
    },
  );

  it("Rule 1 (Underpopulation) — [(0,1),(1,1)], each with 1 neighbor → both die → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("Block (still life) — [(0,0),(1,0),(0,1),(1,1)] stays unchanged across a generation", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it("Blinker (oscillator) Gen0→Gen1 — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(sortCells(result)).toEqual(
      sortCells([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
    );
  });

  it("Blinker (oscillator) Gen1→Gen2 — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)] (returns to original)", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expect(sortCells(result)).toEqual(
      sortCells([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    );
  });

  it("handles negative coordinates — blinker centered away from the origin, e.g. [(-2,-2),(-2,-1),(-2,0)] → [(-3,-1),(-2,-1),(-1,-1)]", () => {
    const result = nextGeneration([
      [-2, -2],
      [-2, -1],
      [-2, 0],
    ]);
    expect(sortCells(result)).toEqual(
      sortCells([
        [-3, -1],
        [-2, -1],
        [-1, -1],
      ]),
    );
  });
});
