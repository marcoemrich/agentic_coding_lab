import { describe, it, expect } from "vitest";
import { evolve } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(evolve([])).toEqual([]);
  });
  it("should kill a live cell with no neighbors (underpopulation)", () => {
    expect(evolve([[0, 0]])).toEqual([]);
  });
  it("should kill a live cell with only 1 neighbor (underpopulation)", () => {
    expect(evolve([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a live cell with exactly 2 neighbors (survival)", () => {
    // blinker [[0,0],[1,0],[2,0]]: center [1,0] survives (2 neighbors)
    // outer cells die (1 neighbor each), dead cells [1,-1] and [1,1] are born (3 neighbors)
    expect(evolve([[0, 0], [1, 0], [2, 0]])).toEqual([[1, 0], [1, -1], [1, 1]]);
  });
  it("should keep a live cell with exactly 3 neighbors (survival)", () => {
    // 2x2 block: each cell has exactly 3 neighbors → all survive
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    expect(evolve(block)).toEqual(block);
  });
  it("should birth a dead cell with exactly 3 live neighbors (reproduction)", () => {
    // dead cell [1,1] has 3 live neighbors: [0,0], [0,1], [1,0] → becomes alive
    // live cells [0,0], [0,1], [1,0] each have 2 neighbors → survive
    expect(evolve([[0, 0], [0, 1], [1, 0]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should advance a blinker one generation", () => {
    // horizontal blinker → vertical blinker
    const horizontal: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const vertical: [number, number][] = [[1, -1], [1, 0], [1, 1]];
    const result = evolve(horizontal);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(vertical));
  });
});
