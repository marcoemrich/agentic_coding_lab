import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty array for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: should kill both cells that each have 1 neighbor — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("Rule 2 Survival: cell (1,0) with 2 live neighbors survives — [(0,0), (1,0), (2,0)] → survivors include (1,0)", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3 Overpopulation: center cell (1,1) with more than 3 live neighbors dies — survivors exclude (1,1)", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: dead cell (1,1) with exactly 3 live neighbors becomes alive — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(result).toContainEqual([1, 1]);
  });
  it("Block still life: should remain unchanged — [(0,0), (1,0), (0,1), (1,1)] → same 4 cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expect(result).toEqual(expect.arrayContaining(block));
    expect(result).toHaveLength(block.length);
  });
  it("Blinker: vertical becomes horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const expected: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  });
  it("Blinker: horizontal becomes vertical again after second generation — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const expected: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(expected.length);
  });
  it("should handle negative coordinates — block at [(-2,-2), (-1,-2), (-2,-1), (-1,-1)] remains unchanged", () => {
    const block: Cell[] = [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
    ];
    const result = nextGeneration(block);
    expect(result).toEqual(expect.arrayContaining(block));
    expect(result).toHaveLength(block.length);
  });
});
