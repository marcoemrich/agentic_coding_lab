import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - Next Generation", () => {
  it("should return an empty array for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells each with 1 neighbor (underpopulation) — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("should keep a live cell with 2 live neighbors alive (survival) — (1,0) survives in [(0,0), (1,0), (2,0), (1,2)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 2],
      ]),
    ).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation) — center (1,1) is absent from the next generation of [(0,0), (1,0), (2,0), (1,1), (0,2), (1,2), (2,2)]", () => {
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
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction) — (1,1) becomes alive in [(0,0), (1,0), (0,1)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("should keep a block still life unchanged — [(0,0), (1,0), (0,1), (1,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    const result = nextGeneration(block);

    expect(result).toHaveLength(block.length);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("should oscillate a vertical blinker into a horizontal one — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expect(sorted(result)).toEqual(
      sorted([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
    );
  });
  it("should oscillate a horizontal blinker back to a vertical one after two generations — [(0,0), (0,1), (0,2)] → gen 2 → [(0,0), (0,1), (0,2)]", () => {
    const blinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const generationTwo = nextGeneration(nextGeneration(blinker));

    expect(sorted(generationTwo)).toEqual(sorted(blinker));
  });
  it("should handle negative coordinates — blinker at [(-5,-5), (-5,-4), (-5,-3)] → [(-6,-4), (-5,-4), (-4,-4)]", () => {
    const result = nextGeneration([
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ]);

    expect(sorted(result)).toEqual(
      sorted([
        [-6, -4],
        [-5, -4],
        [-4, -4],
      ]),
    );
  });
});
