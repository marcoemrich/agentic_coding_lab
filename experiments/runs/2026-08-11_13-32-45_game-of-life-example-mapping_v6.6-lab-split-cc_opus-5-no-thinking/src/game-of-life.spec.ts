import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - next generation", () => {
  it("should return an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single lone cell (0 neighbors) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: should kill both cells that have 1 neighbor each — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("Rule 2 Survival: should keep a live cell with 3 live neighbors alive — center (1,1) survives", () => {
    // Gen 0: ### on the top row, plus the live centre cell (1,1).
    // (1,1) is live and has exactly 3 live neighbours: (0,0), (1,0), (2,0).
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);

    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 Overpopulation: should kill a live cell with 4 live neighbors — center (1,1) dies", () => {
    // Gen 0: the live centre (1,1) surrounded by the four corners of its
    // 3x3 box, giving it exactly 4 live neighbours.
    const result = nextGeneration([
      [0, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [2, 2],
    ]);

    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: should bring a dead cell with exactly 3 live neighbors to life — (1,1) becomes alive", () => {
    // Gen 0: an L-shaped triomino. The dead cell (1,1) is adjacent to all
    // three live cells, so it has exactly 3 live neighbours and is born.
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life: should leave the block unchanged — [(0,0),(1,0),(0,1),(1,1)] → same 4 cells", () => {
    // Every cell of a 2x2 block has exactly 3 live neighbours (two
    // orthogonal, one diagonal) and survives; no dead cell around it reaches 3.
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("Blinker: should rotate a vertical blinker to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    // The centre (0,1) has exactly 2 live neighbours and survives; the two
    // ends have 1 each and die; (-1,1) and (1,1) each have 3 and are born.
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
  it("Blinker: should rotate a horizontal blinker back to vertical — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    // Completes the oscillation: gen 2 returns to the gen 0 shape.
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);

    expect(sorted(result)).toEqual(
      sorted([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    );
  });
  it("should handle negative coordinates — blinker at [(-5,-5),(-5,-4),(-5,-3)] → [(-6,-4),(-5,-4),(-4,-4)]", () => {
    // The grid is infinite in all directions: the same blinker behaviour
    // must hold entirely within negative space.
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
