import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - next generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone live cell (0 neighbours) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 – underpopulation: kills two adjacent cells with 1 neighbour each — [(0,1),(1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("Rule 2 – survival: a live cell with 2 live neighbours lives on — (1,0) survives in [(0,0),(1,0),(2,0),(1,2)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 2],
    ]);

    expect(result).toContainEqual([1, 0]);
  });

  it("Rule 3 – overpopulation: a live cell with 4 live neighbours dies — (1,1) is absent from the next generation", () => {
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

  it("Rule 4 – reproduction: a dead cell with exactly 3 neighbours becomes alive — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(sorted(result)).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });

  it("Block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);

    expect(sorted(result)).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });

  it("Blinker oscillates to horizontal, using negative coordinates — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expect(sorted(result)).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });

  it("Blinker oscillates back to vertical after two generations — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);

    expect(sorted(result)).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });
});
