import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: kills two adjacent cells, each with 1 neighbor — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("Rule 2 Survival: a live cell with 2 live neighbors lives on — in [(0,0), (1,0), (2,0), (1,2)] the cell (1,0) survives", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 2],
      ]),
    ).toContainEqual([1, 0]);
  });
  it("Rule 3 Overpopulation: a live cell with 4 live neighbors dies — in [(0,0), (1,0), (2,0), (1,1), (0,2), (1,2), (2,2)] the center (1,1) dies", () => {
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
  it("Rule 4 Reproduction: a dead cell with exactly 3 live neighbors becomes alive — [(0,0), (1,0), (0,1)] → includes (1,1)", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("Block still life: [(0,0), (1,0), (0,1), (1,1)] stays unchanged", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("Blinker gen 0 → gen 1: [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const verticalBlinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const horizontalBlinker: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    expect(sorted(nextGeneration(verticalBlinker))).toEqual(
      sorted(horizontalBlinker),
    );
  });
  it("Blinker gen 1 → gen 2: [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const horizontalBlinker: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const verticalBlinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    expect(sorted(nextGeneration(horizontalBlinker))).toEqual(
      sorted(verticalBlinker),
    );
  });
  it("handles negative coordinates — block at [(-2,-2), (-1,-2), (-2,-1), (-1,-1)] stays unchanged", () => {
    const negativeBlock: Cell[] = [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
    ];
    expect(sorted(nextGeneration(negativeBlock))).toEqual(sorted(negativeBlock));
  });
});
