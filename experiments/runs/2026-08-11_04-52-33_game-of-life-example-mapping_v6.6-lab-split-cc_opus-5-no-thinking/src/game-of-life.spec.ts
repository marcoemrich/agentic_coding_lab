import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - next generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills both cells when each has only 1 neighbor (underpopulation) — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("keeps a live cell alive with 2 live neighbors (survival) — (0,0) of [(0,0), (1,0), (2,0), (1,1)] survives", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ]),
    ).toContainEqual([0, 0]);
  });
  it("keeps a live cell alive with 3 live neighbors (survival) — (1,0) of [(0,0), (1,0), (2,0), (1,1)] survives", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ]),
    ).toContainEqual([1, 0]);
  });
  it("kills a live cell with more than 3 live neighbors (overpopulation) — center (1,1) of [###/.#./###] is absent from gen 1", () => {
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
  it("brings a dead cell with exactly 3 live neighbors to life (reproduction) — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("oscillates a vertical blinker into a horizontal one — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    expect(
      sorted(
        nextGeneration([
          [0, 0],
          [0, 1],
          [0, 2],
        ]),
      ),
    ).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  it("oscillates a horizontal blinker back to vertical — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    expect(
      sorted(
        nextGeneration([
          [-1, 1],
          [0, 1],
          [1, 1],
        ]),
      ),
    ).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });
  it("leaves a block still life unchanged — [(0,0), (1,0), (0,1), (1,1)] → unchanged", () => {
    expect(
      sorted(
        nextGeneration([
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ]),
      ),
    ).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("handles negative coordinates — block at [(-2,-2), (-1,-2), (-2,-1), (-1,-1)] → unchanged", () => {
    expect(
      sorted(
        nextGeneration([
          [-2, -2],
          [-1, -2],
          [-2, -1],
          [-1, -1],
        ]),
      ),
    ).toEqual([
      [-2, -2],
      [-2, -1],
      [-1, -2],
      [-1, -1],
    ]);
  });
});
