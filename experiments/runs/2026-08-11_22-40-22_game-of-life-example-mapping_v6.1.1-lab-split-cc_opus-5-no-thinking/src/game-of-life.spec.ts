import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

/** Output ordering is unspecified, so compare cells order-insensitively. */
const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single live cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 (underpopulation): kills two adjacent cells, each with 1 neighbor — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("Rule 2 (survival): a live cell with 2 live neighbors lives on — [(0,0), (1,0), (2,0), (1,2)] → [(1,-1), (1,0), (0,1), (2,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 2],
    ]);

    expect(sortCells(result)).toEqual(
      sortCells([
        [1, -1],
        [1, 0],
        [0, 1],
        [2, 1],
      ]),
    );
  });

  it("Rule 4 (reproduction): a dead cell with exactly 3 live neighbors becomes alive — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
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
  });

  it("Rule 3 (overpopulation): the center cell with 6 live neighbors dies — [(0,0), (1,0), (2,0), (1,1), (0,2), (1,2), (2,2)] → [(1,-1), (0,0), (1,0), (2,0), (0,2), (1,2), (2,2), (1,3)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);

    expect(sortCells(result)).toEqual(
      sortCells([
        [1, -1],
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 2],
        [1, 2],
        [2, 2],
        [1, 3],
      ]),
    );
  });

  it("block still life stays unchanged — [(0,0), (1,0), (0,1), (1,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it("blinker oscillates: vertical to horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
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

  it("blinker oscillates back: horizontal to vertical — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
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

  it("handles negative coordinates — [(-1,-1), (0,-1), (-1,0), (0,0)] → [(-1,-1), (0,-1), (-1,0), (0,0)]", () => {
    const blockInNegativeQuadrant: Cell[] = [
      [-1, -1],
      [0, -1],
      [-1, 0],
      [0, 0],
    ];

    expect(sortCells(nextGeneration(blockInNegativeQuadrant))).toEqual(
      sortCells(blockInNegativeQuadrant),
    );
  });
});
