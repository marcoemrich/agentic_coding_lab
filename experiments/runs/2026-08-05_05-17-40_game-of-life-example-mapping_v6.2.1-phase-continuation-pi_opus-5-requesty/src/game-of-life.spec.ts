import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("should return an empty array for an empty grid -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single lonely cell -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("rule 1 underpopulation: two adjacent cells with 1 neighbour each die -- [(0,1),(1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("rule 2 survival: a live cell with 2 live neighbours lives on -- (1,0) still alive in next generation of [(0,0),(1,0),(2,0)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
    ).toContainEqual([1, 0]);
  });
  it("rule 2 survival: a live cell with 3 live neighbours lives on -- (0,0) still alive in next generation of [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    ).toContainEqual([0, 0]);
  });
  it("rule 3 overpopulation: a live cell with 4 live neighbours dies -- next generation of the plus-corners pattern excludes (1,1)", () => {
    const generation0: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    expect(nextGeneration(generation0)).not.toContainEqual([1, 1]);
  });
  it("rule 4 reproduction: a dead cell with exactly 3 live neighbours becomes alive -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(new Set(result.map(String))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"]),
    );
  });
  it("blinker generation 0 -> 1: [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
    expect(new Set(result.map(String))).toEqual(
      new Set(["-1,1", "0,1", "1,1"]),
    );
  });
  it("blinker generation 1 -> 2: [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expect(new Set(result.map(String))).toEqual(
      new Set(["0,0", "0,1", "0,2"]),
    );
  });
  it("block still life stays unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(new Set(nextGeneration(block).map(String))).toEqual(
      new Set(block.map(String)),
    );
  });
  it("handles negative coordinates -- blinker at [(-5,-5),(-5,-4),(-5,-3)] -> [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const result = nextGeneration([
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ]);
    expect(new Set(result.map(String))).toEqual(
      new Set(["-6,-4", "-5,-4", "-4,-4"]),
    );
  });
});
