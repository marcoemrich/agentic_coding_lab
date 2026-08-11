import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

const expectCells = (actual: Cell[], expected: Cell[]): void => {
  expect(sorted(actual)).toEqual(sorted(expected));
};

describe("Game of Life - nextGeneration", () => {
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

  it("keeps a live cell with 2 live neighbors alive (survival) — [(0,0), (1,0), (2,0)] keeps (1,0) alive", () => {
    expectCells(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
      [
        [1, -1],
        [1, 0],
        [1, 1],
      ],
    );
  });

  it("keeps a live cell with 3 live neighbors alive (survival) — [(0,0), (1,0), (2,0), (1,1)] keeps (1,1) alive", () => {
    expectCells(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ]),
      [
        [1, -1],
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
    );
  });

  it("kills a live cell with more than 3 live neighbors (overpopulation) — center (1,1) of [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] dies", () => {
    expectCells(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ]),
      [
        [1, -1],
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 2],
        [1, 2],
        [2, 2],
        [1, 3],
      ],
    );
  });

  it("brings a dead cell with exactly 3 live neighbors to life (reproduction) — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    expectCells(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    );
  });

  it("leaves a block still life unchanged — [(0,0),(1,0),(0,1),(1,1)] → same 4 cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectCells(nextGeneration(block), block);
  });

  it("oscillates a vertical blinker into a horizontal one — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    expectCells(
      nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
      [
        [-1, 1],
        [0, 1],
        [1, 1],
      ],
    );
  });

  it("returns a blinker to its original orientation after two generations — [(0,0),(0,1),(0,2)] → gen2 = [(0,0),(0,1),(0,2)]", () => {
    const blinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    expectCells(nextGeneration(nextGeneration(blinker)), blinker);
  });

  it("handles negative coordinates — blinker at [(-5,-5),(-5,-4),(-5,-3)] → [(-6,-4),(-5,-4),(-4,-4)]", () => {
    expectCells(
      nextGeneration([
        [-5, -5],
        [-5, -4],
        [-5, -3],
      ]),
      [
        [-6, -4],
        [-5, -4],
        [-4, -4],
      ],
    );
  });
});
