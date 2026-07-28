import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - nextGeneration", () => {
  it("single cell dies: [(0,0)] -> [] (spec example)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: two adjacent live cells each have 1 neighbor and die: [(0,1),(1,1)] -> [] (spec example)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 reproduction: dead cell (1,1) with exactly 3 live neighbors becomes alive: [(0,0),(1,0),(0,1)] -> [(0,0),(0,1),(1,0),(1,1)] (spec example)", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(
      sorted([[0, 0], [0, 1], [1, 0], [1, 1]]),
    );
  });
  it("Rule 2 survival with 3 neighbors / Block still life: [(0,0),(1,0),(0,1),(1,1)] -> unchanged (spec example)", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual(
      sorted([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
  it("Rule 2 survival with 2 neighbors / Blinker vertical -> horizontal: [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)] (spec example, negative coords)", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(
      sorted([[-1, 1], [0, 1], [1, 1]]),
    );
  });
  it("Rule 3 overpopulation: cross center (0,0) has 4 neighbors and dies: [(0,0),(1,0),(-1,0),(0,1),(0,-1)] -> ring of 8 cells", () => {
    expect(
      sorted(nextGeneration([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]])),
    ).toEqual(
      sorted([
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ]),
    );
  });
  it("Blinker is period-2 oscillator: two generations return [(0,0),(0,1),(0,2)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sorted(nextGeneration(nextGeneration(vertical)))).toEqual(
      sorted(vertical),
    );
  });
});
