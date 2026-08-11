import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const byCoordinate = ([ax, ay]: Cell, [bx, by]: Cell): number =>
  ax - bx || ay - by;

describe("Game of Life - nextGeneration", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("lets a single cell die — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells with 1 neighbor each die — [(0,1),(1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("Rule 2 Survival: a live cell with 3 live neighbors lives on — [(0,0),(1,0),(2,0),(1,1)] keeps (1,0) alive", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);

    expect(next).toContainEqual([1, 0]);
  });
  it("Rule 3 Overpopulation: a live cell with more than 3 live neighbors dies — 3x3 ring plus center kills (1,1)", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: a dead cell with exactly 3 live neighbors becomes alive — [(0,0),(1,0),(0,1)] → includes (1,1)", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(next).toContainEqual([1, 1]);
  });
  it("Block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → same 4 cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(nextGeneration(block).sort(byCoordinate)).toEqual(
      [...block].sort(byCoordinate),
    );
  });
  it("Blinker oscillates: vertical becomes horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expect(next.sort(byCoordinate)).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  it("Blinker oscillates back: horizontal becomes vertical — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const next = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);

    expect(next.sort(byCoordinate)).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });
  it("handles negative coordinates on the infinite grid — blinker at [(-5,-5),(-5,-4),(-5,-3)] → [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const next = nextGeneration([
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ]);

    expect(next.sort(byCoordinate)).toEqual([
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ]);
  });
});
