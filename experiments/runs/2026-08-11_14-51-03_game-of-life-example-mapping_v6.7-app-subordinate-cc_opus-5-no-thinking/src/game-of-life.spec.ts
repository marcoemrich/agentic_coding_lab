import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - Next Generation", () => {
  it("returns no living cells for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone live cell with 0 neighbors (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills both live cells when each has only 1 neighbor (underpopulation) — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("keeps a live cell alive when it has exactly 3 neighbors (survival) — center (1,1) of [(0,0), (1,0), (2,0), (1,1)] survives", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });

  it("kills a live cell when it has more than 3 neighbors (overpopulation) — center (1,1) of the ### / .#. / ### grid has 4 neighbors and dies", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });

  it("brings a dead cell to life when it has exactly 3 neighbors (reproduction) — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
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

  it("keeps a block unchanged (still life) — [(0,0), (1,0), (0,1), (1,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it("oscillates a vertical blinker into a horizontal one — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
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

  it("oscillates the horizontal blinker back to vertical after a second generation — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const verticalBlinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const afterTwoGenerations = nextGeneration(nextGeneration(verticalBlinker));

    expect(sortCells(afterTwoGenerations)).toEqual(sortCells(verticalBlinker));
  });

  it("handles negative coordinates — blinker at [(-5,-5), (-5,-4), (-5,-3)] → [(-6,-4), (-5,-4), (-4,-4)]", () => {
    const result = nextGeneration([
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ]);

    expect(sortCells(result)).toEqual(
      sortCells([
        [-6, -4],
        [-5, -4],
        [-4, -4],
      ]),
    );
  });
});
