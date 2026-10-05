import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("empty grid remains []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell at (0,0) dies to []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("adjacent pair at (0,1),(1,1) dies to []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live center with two neighbors survives", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("live center with three neighbors survives", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("live center with four neighbors dies", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it("diagram center with six neighbors dies", () => {
    expect(nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ])).not.toContainEqual([1, 1]);
  });
  it("L shape reproduces (1,1) to form a block", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("dead center with two neighbors stays dead", () => {
    expect(nextGeneration([[-1, 0], [1, 0]])).not.toContainEqual([0, 0]);
  });
  it("dead center with four neighbors stays dead", () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it("vertical blinker becomes (-1,1),(0,1),(1,1)", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("blinker returns to original after two generations", () => {
    const result = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
  it("four-cell block remains unchanged", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("block remains unchanged at large negative and positive coordinates", () => {
    const cells: Cell[] = [
      [-1000000, -1000000], [-999999, -1000000],
      [-1000000, -999999], [-999999, -999999],
      [1000000, 1000000], [1000001, 1000000],
      [1000000, 1000001], [1000001, 1000001],
    ];
    const result = nextGeneration(cells);
    expect(result).toHaveLength(cells.length);
    expect(result).toEqual(expect.arrayContaining(cells));
  });
});
