import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ay - by || ax - bx);

describe("Game of Life - next generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single live cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 Underpopulation: kills both cells of a pair, each having 1 neighbor — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("Rule 2 Survival: a live cell with 3 live neighbors survives — (1,1) of [(0,0),(1,0),(2,0),(1,1)] stays alive", () => {
    const nextCells = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);

    expect(nextCells).toContainEqual([1, 1]);
  });

  it("Rule 3 Overpopulation: a live cell with 4 live neighbors dies — center (1,1) of the ring-plus-center pattern is not in the next generation", () => {
    const nextCells = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);

    expect(nextCells).not.toContainEqual([1, 1]);
  });

  it("Rule 4 Reproduction: a dead cell with exactly 3 live neighbors becomes alive — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const nextCells = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(sorted(nextCells)).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("Block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(sorted(nextGeneration(block))).toEqual(block);
  });

  it("Blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const verticalBlinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    expect(sorted(nextGeneration(verticalBlinker))).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });

  it("Blinker oscillates back to vertical after two generations — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const horizontalBlinker: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    expect(sorted(nextGeneration(horizontalBlinker))).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  it("handles negative coordinates — blinker at [(-5,-5),(-5,-4),(-5,-3)] → [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const blinkerInNegativeSpace: Cell[] = [
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ];

    expect(sorted(nextGeneration(blinkerInNegativeSpace))).toEqual([
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ]);
  });
});
