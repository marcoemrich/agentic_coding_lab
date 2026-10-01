import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("rule 1 underpopulation: cells with 1 neighbor die — [(0,1),(1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("rule 2 survival: live center cell (1,1) with 3 live neighbors survives", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);
    expect(next).toContainEqual([1, 1]);
  });
  it("rule 3 overpopulation: live center cell (1,1) with more than 3 live neighbors dies", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("rule 4 reproduction: dead cell (1,1) with exactly 3 neighbors is born — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(sorted(next)).toEqual(
      sorted([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    );
  });
  it("block is a still life — [(0,0),(1,0),(0,1),(1,1)] → unchanged", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("blinker gen 0 → gen 1 — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(sorted(next)).toEqual(
      sorted([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
    );
  });
  it("blinker gen 1 → gen 2 — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const next = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expect(sorted(next)).toEqual(
      sorted([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    );
  });
  it("handles negative coordinates — block at [(-5,-5),(-4,-5),(-5,-4),(-4,-4)] → unchanged", () => {
    const block: Cell[] = [
      [-5, -5],
      [-4, -5],
      [-5, -4],
      [-4, -4],
    ];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
});
