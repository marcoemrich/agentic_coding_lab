import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

/** Cells have no defined output order, so compare them as sorted sets. */
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - nextGeneration", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone live cell with no neighbors — [(0,0)] → [] (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills both cells of a pair, each having only 1 neighbor — [(0,1), (1,1)] → [] (rule 1, underpopulation)", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("keeps a live cell with 2 neighbors alive — [(0,0),(1,0),(2,0)] → [(1,0)] plus births (rule 2, survival)", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
    ).toEqual(expect.arrayContaining([[1, 0]]));
  });

  it("kills a live cell with more than 3 neighbors — center of a full ring dies (rule 3, overpopulation)", () => {
    const ringWithCentre: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    expect(nextGeneration(ringWithCentre)).not.toContainEqual([1, 1]);
  });

  it("brings a dead cell with exactly 3 neighbors to life — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)] (rule 4, reproduction)", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(sorted(result)).toEqual(
      sorted([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    );
  });

  it("leaves a block unchanged — [(0,0),(1,0),(0,1),(1,1)] → [(0,0),(1,0),(0,1),(1,1)] (still life)", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it("oscillates a vertical blinker into a horizontal one, producing negative coordinates — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const verticalBlinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    expect(sorted(nextGeneration(verticalBlinker))).toEqual(
      sorted([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
    );
  });

  it("oscillates a horizontal blinker back to vertical after a second generation — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const horizontalBlinker: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    expect(sorted(nextGeneration(horizontalBlinker))).toEqual(
      sorted([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    );
  });
});
