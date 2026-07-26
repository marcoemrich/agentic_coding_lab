import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated live cell from underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with fewer than 2 neighbors (Rule 1 underpopulation) -- [(0,1), (1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should let live cells with 2 or 3 neighbors survive (Rule 2 survival) -- center of [(0,0), (1,0), (2,0)] survives at (1,0)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("should kill live cells with more than 3 neighbors (Rule 3 overpopulation) -- plus shape center (1,1) dies", () => {
    const plus = [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ];
    expect(nextGeneration(plus)).not.toContainEqual([1, 1]);
  });
  it("should birth dead cells with exactly 3 neighbors (Rule 4 reproduction) -- [(0,0), (1,0), (0,1)] becomes [(0,0), (1,0), (0,1), (1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual(
      expect.arrayContaining([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ])
    );
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toHaveLength(4);
  });
  it("should leave a 2x2 block unchanged (still life) -- [(0,0), (1,0), (0,1), (1,1)] stays the same", () => {
    const block = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("should oscillate a vertical blinker to horizontal (Gen 0 to Gen 1) -- [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  it("should oscillate a horizontal blinker back to vertical (Gen 1 to Gen 2) -- [(-1,1), (0,1), (1,1)] becomes [(0,0), (0,1), (0,2)]", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]])).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });
});
