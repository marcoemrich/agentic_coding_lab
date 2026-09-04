import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// The order of cells in a generation carries no meaning, so compare as sorted sets.
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("returns an empty grid for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single lone cell (0 neighbors) — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation (live cell with < 2 live neighbors dies)
  it("kills both cells of a horizontal pair, each having 1 neighbor — [(0,1),(1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  // Rule 2 - Survival (live cell with 2 or 3 live neighbors lives on)
  it("keeps a live cell with exactly 2 live neighbors alive — (1,1) survives in [(0,1),(1,1),(2,1)]", () => {
    const result = nextGeneration([
      [0, 1],
      [1, 1],
      [2, 1],
    ]);

    expect(sorted(result)).toEqual(
      sorted([
        [1, 0],
        [1, 1],
        [1, 2],
      ]),
    );
  });
  it("keeps a live cell with exactly 3 live neighbors alive — (1,1) survives in [(0,2),(1,2),(2,2),(1,1)]", () => {
    const result = nextGeneration([
      [0, 2],
      [1, 2],
      [2, 2],
      [1, 1],
    ]);

    expect(sorted(result)).toEqual(
      sorted([
        [0, 2],
        [1, 2],
        [2, 2],
        [1, 1],
        [0, 1],
        [2, 1],
        [1, 3],
      ]),
    );
  });

  // Rule 3 - Overpopulation (live cell with > 3 live neighbors dies)
  it("kills a live cell with 4 live neighbors — (1,1) dies in [(0,2),(1,2),(2,2),(1,1),(1,0)]", () => {
    const result = nextGeneration([
      [0, 2],
      [1, 2],
      [2, 2],
      [1, 1],
      [1, 0],
    ]);

    expect(result).not.toContainEqual([1, 1]);
    expect(sorted(result)).toEqual(
      sorted([
        [0, 2],
        [1, 2],
        [2, 2],
        [1, 3],
      ]),
    );
  });

  // Rule 4 - Reproduction (dead cell with exactly 3 live neighbors becomes alive)
  it("brings a dead cell with exactly 3 live neighbors to life — (1,1) becomes alive in [(0,2),(1,2),(0,1)]", () => {
    const result = nextGeneration([
      [0, 2],
      [1, 2],
      [0, 1],
    ]);

    expect(result).toContainEqual([1, 1]);
    expect(sorted(result)).toEqual(
      sorted([
        [0, 2],
        [1, 2],
        [0, 1],
        [1, 1],
      ]),
    );
  });
  it("leaves a dead cell with 2 live neighbors dead — (1,1) stays dead in [(0,1),(2,1)]", () => {
    const result = nextGeneration([
      [0, 1],
      [2, 1],
    ]);

    expect(result).not.toContainEqual([1, 1]);
    expect(result).toEqual([]);
  });

  // Negative coordinates / infinite grid
  it("handles negative coordinates — block at [(-1,-1),(0,-1),(-1,0),(0,0)] is unchanged", () => {
    const block: Cell[] = [
      [-1, -1],
      [0, -1],
      [-1, 0],
      [0, 0],
    ];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  // Patterns
  it("keeps the block still life unchanged — [(0,0),(1,0),(0,1),(1,1)] -> same 4 cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("oscillates the blinker from vertical to horizontal — [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
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
  it("oscillates the blinker back to vertical after a second generation — [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const gen2 = nextGeneration(nextGeneration(gen0));

    expect(sorted(gen2)).toEqual(sorted(gen0));
  });
});
