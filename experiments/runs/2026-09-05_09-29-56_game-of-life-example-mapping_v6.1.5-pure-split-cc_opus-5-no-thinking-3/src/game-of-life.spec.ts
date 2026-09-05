import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 (underpopulation): kills two cells that each have 1 neighbor — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  // NOTE: the spec's Rule 2 illustration is internally inconsistent — it labels
  // (1,1) as a live cell with 3 neighbors, but in its Gen 0 grid (1,1) is dead
  // and has 4 live neighbors, and its Gen 1 picture is unreachable under the
  // four rules. This test asserts survival with 2 neighbors, which is what
  // Rule 2 actually states, using an unambiguous configuration.
  it("Rule 2 (survival): a live cell with 2 live neighbors lives on — [(0,0), (1,0), (2,0)] → [(1,0), (1,-1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(sorted(result)).toEqual(sorted([[1, 0], [1, -1], [1, 1]]));
  });
  // NOTE: the spec's Gen 1 picture (#.#/#.#/#.#) is a crop of the 3x3 window.
  // On an infinite grid (1,-1) and (1,3) each have exactly 3 live neighbors and
  // are also born, so the full next generation has 8 cells.
  it("Rule 3 (overpopulation): center cell with 6 neighbors dies — the ring survives, center does not", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(sorted(result)).toEqual(
      sorted([[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, -1], [1, 3]]),
    );
  });
  it("Rule 4 (reproduction): dead cell with exactly 3 neighbors becomes alive — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sorted(result)).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("Block still life stays unchanged — [(0,0), (1,0), (0,1), (1,1)] → same 4 cells", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("Blinker oscillates from vertical to horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sorted(result)).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("Blinker oscillates back to vertical after two generations — [(0,0), (0,1), (0,2)] → back to itself", () => {
    const blinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sorted(nextGeneration(nextGeneration(blinker)))).toEqual(sorted(blinker));
  });
  it("handles negative coordinates — blinker at negative offset oscillates correctly", () => {
    const result = nextGeneration([[-10, -5], [-10, -4], [-10, -3]]);
    expect(sorted(result)).toEqual(sorted([[-11, -4], [-10, -4], [-9, -4]]));
  });
});
