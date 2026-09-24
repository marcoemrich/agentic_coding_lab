import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration on an infinite sparse grid", () => {
  it("empty generation [] remains []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell [(0,0)] dies to []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation: adjacent pair [(0,1),(1,1)] dies to []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("survival: a live cell with two neighbors lives on", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("survival: center (1,1) with three neighbors lives on", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("overpopulation: center (1,1) with four neighbors dies", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("overpopulation: center (1,1) surrounded by eight neighbors dies", () => {
    const square = [0, 1, 2].flatMap(y => [0, 1, 2].map(x => [x, y] as [number, number]));
    expect(nextGeneration(square)).not.toContainEqual([1, 1]);
  });
  it("reproduction: dead (1,1) with three neighbors becomes alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("dead cell with only two neighbors stays dead", () => {
    expect(nextGeneration([[0, 0], [2, 0]])).not.toContainEqual([1, 0]);
  });
  it("block [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(new Set(nextGeneration(block).map(cell => JSON.stringify(cell)))).toEqual(new Set(block.map(cell => JSON.stringify(cell))));
  });
  it("blinker vertical [(0,0),(0,1),(0,2)] becomes horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(new Set(result.map(cell => JSON.stringify(cell)))).toEqual(
      new Set([[-1, 1], [0, 1], [1, 1]].map(cell => JSON.stringify(cell)))
    );
  });
  it("blinker horizontal [(-1,1),(0,1),(1,1)] becomes vertical [(0,0),(0,1),(0,2)]", () => {
    const first = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const second = nextGeneration(first);
    expect(new Set(second.map(cell => JSON.stringify(cell)))).toEqual(
      new Set([[0, 0], [0, 1], [0, 2]].map(cell => JSON.stringify(cell)))
    );
  });
  it("negative x and y coordinates evolve by the same rules", () => {
    const result = nextGeneration([[-6, -5], [-5, -5], [-4, -5]]);
    expect(new Set(result.map(cell => JSON.stringify(cell)))).toEqual(
      new Set([[-5, -6], [-5, -5], [-5, -4]].map(cell => JSON.stringify(cell)))
    );
  });
  it("widely separated live cells have no artificial grid boundary", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1000000, -1000000]]);
    expect(new Set(result.map(cell => JSON.stringify(cell)))).toEqual(
      new Set([[1, -1], [1, 0], [1, 1]].map(cell => JSON.stringify(cell)))
    );
  });
});
