import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration on an infinite sparse grid", () => {
  it("empty living cells [] produce []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("one live cell [(0,0)] dies with zero neighbors, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("adjacent live cells [(0,1),(1,1)] each die with one neighbor, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with two neighbors survives: (1,1) remains alive", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toContainEqual([1, 1]);
  });
  it("a live center (1,1) with three neighbors survives", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("a live center (1,1) with four neighbors dies from overpopulation", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("a dead cell (1,1) with exactly three neighbors becomes alive from [(0,0),(1,0),(0,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("a 2x2 block [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("vertical blinker [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]]).map(cell => cell.join(",")).sort())
      .toEqual(["-1,1", "0,1", "1,1"]);
  });
  it("horizontal blinker [(-1,1),(0,1),(1,1)] becomes [(0,0),(0,1),(0,2)]", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]]).map(cell => cell.join(",")).sort())
      .toEqual(["0,0", "0,1", "0,2"]);
  });
  it("living cells at distant negative x and y coordinates follow the same neighbor rules without grid bounds", () => {
    const blocks: [number, number][] = [
      [-1000, -2000], [-999, -2000], [-1000, -1999], [-999, -1999],
      [1000, 2000], [1001, 2000], [1000, 2001], [1001, 2001],
    ];
    expect(nextGeneration(blocks).map(cell => cell.join(",")).sort())
      .toEqual(blocks.map(cell => cell.join(",")).sort());
  });
});
