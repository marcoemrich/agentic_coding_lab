import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life";

describe("nextGeneration", () => {
  it("empty living-cell grid produces []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell (0,0) dies from zero neighbors, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation example: adjacent (0,1),(1,1) each have one neighbor and produce []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a dead cell with only two neighbors stays dead", () => {
    expect(nextGeneration([[0, 0], [2, 0]])).toEqual([]);
  });
  it("survival with two neighbors keeps the live center (1,1)", () => {
    expect(nextGeneration([[1, 1], [0, 1], [1, 0]])).toContainEqual([1, 1]);
  });
  it("survival example: live center (1,1) with three neighbors lives", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("overpopulation example: live center (1,1) with four neighbors dies", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]])).not.toContainEqual([1, 1]);
  });
  it("reproduction example: dead (1,1) with exactly three neighbors becomes alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("block example: (0,0),(1,0),(0,1),(1,1) remains unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(block).map((cell) => JSON.stringify(cell))))
      .toEqual(new Set(block.map((cell) => JSON.stringify(cell))));
  });
  it("blinker example: (0,0),(0,1),(0,2) becomes (-1,1),(0,1),(1,1)", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map((cell) => JSON.stringify(cell))))
      .toEqual(new Set([[-1, 1], [0, 1], [1, 1]].map((cell) => JSON.stringify(cell))));
  });
  it("blinker second generation returns to (0,0),(0,1),(0,2)", () => {
    const original: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(nextGeneration(original));
    expect(new Set(result.map((cell) => JSON.stringify(cell))))
      .toEqual(new Set(original.map((cell) => JSON.stringify(cell))));
  });
  it("negative x and y coordinates support reproduction across the origin", () => {
    expect(nextGeneration([[-1, -1], [0, -1], [-1, 0]])).toContainEqual([0, 0]);
  });
  it("widely separated live cells do not spawn cells between them on the infinite sparse grid", () => {
    expect(nextGeneration([[0, 0], [1_000_000, -1_000_000]])).toEqual([]);
  });
});
