import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sortCells = (cells: [number, number][]): [number, number][] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  // Degenerate cases
  it("an empty grid stays empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation
  it("two adjacent live cells both die (each has 1 neighbor)", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  // Rule 4 - Reproduction
  it("a dead cell with exactly 3 live neighbors becomes alive", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(next).toContainEqual([1, 1]);
  });

  // Rule 2 - Survival
  it("a live cell with 2 or 3 live neighbors survives", () => {
    // (0,0) has live neighbors (1,0) and (0,1) => 2 neighbors => survives
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(next).toContainEqual([0, 0]);
  });

  // Rule 3 - Overpopulation
  it("a live cell with more than 3 live neighbors dies", () => {
    // (1,1) has 4 diagonal live neighbors => overpopulation => dies
    const next = nextGeneration([
      [1, 1],
      [0, 0],
      [2, 0],
      [0, 2],
      [2, 2],
    ]);
    expect(next).not.toContainEqual([1, 1]);
  });

  // Negative coordinates
  it("handles negative coordinates", () => {
    // vertical blinker at x = -5 becomes horizontal row at y = 0
    const next = nextGeneration([
      [-5, -1],
      [-5, 0],
      [-5, 1],
    ]);
    expect(sortCells(next)).toEqual(
      sortCells([
        [-6, 0],
        [-5, 0],
        [-4, 0],
      ]),
    );
  });

  // Pattern examples
  it("blinker oscillates from vertical to horizontal", () => {
    const next = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(sortCells(next)).toEqual(
      sortCells([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
    );
  });
  it("block still life remains unchanged", () => {
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
});
