import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it(
    "should kill a single isolated live cell (underpopulation) -- [(0,0)] becomes []",
    () => {
      expect(nextGeneration([[0, 0]])).toEqual([]);
    },
  );
  it(
    "should kill two adjacent live cells with only one neighbor each (underpopulation) -- [(0,1), (1,1)] becomes []",
    () => {
      expect(
        nextGeneration([
          [0, 1],
          [1, 1],
        ]),
      ).toEqual([]);
    },
  );
  it(
    "should preserve a 2x2 block still life unchanged -- [(0,0), (1,0), (0,1), (1,1)] stays the same",
    () => {
      const block: [number, number][] = [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ];
      expect(nextGeneration(block)).toEqual(block);
    },
  );
  it(
    "should let a live cell with 2 neighbors survive -- [(0,0), (1,0), (2,0)] becomes [(1,-1), (1,0), (1,1)]",
    () => {
      expect(
        nextGeneration([
          [0, 0],
          [1, 0],
          [2, 0],
        ]),
      ).toEqual([
        [1, 0],
        [1, -1],
        [1, 1],
      ]);
    },
  );
  it(
    "should kill a live cell with more than 3 neighbors (overpopulation) -- center (1,1) dies, arms survive",
    () => {
      expect(
        nextGeneration([
          [1, 0],
          [0, 1],
          [1, 1],
          [2, 1],
          [1, 2],
        ]),
      ).toEqual([
        [1, 0],
        [0, 1],
        [2, 1],
        [1, 2],
        [0, 0],
        [2, 0],
        [0, 2],
        [2, 2],
      ]);
    },
  );
  it(
    "should birth a dead cell with exactly 3 live neighbors (reproduction) -- [(0,2), (1,2), (0,1)] becomes [(0,2), (1,2), (0,1), (1,1)]",
    () => {
      expect(
        nextGeneration([
          [0, 2],
          [1, 2],
          [0, 1],
        ]),
      ).toEqual([
        [0, 2],
        [1, 2],
        [0, 1],
        [1, 1],
      ]);
    },
  );
  it(
    "should evolve blinker horizontally to vertical -- [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]",
    () => {
      expect(
        nextGeneration([
          [0, 0],
          [0, 1],
          [0, 2],
        ]),
      ).toEqual([
        [0, 1],
        [-1, 1],
        [1, 1],
      ]);
    },
  );
  it(
    "should evolve blinker vertical back to horizontal -- [(-1,1), (0,1), (1,1)] becomes [(0,0), (0,1), (0,2)]",
    () => {
      expect(
        nextGeneration([
          [-1, 1],
          [0, 1],
          [1, 1],
        ]),
      ).toEqual([
        [0, 1],
        [0, 0],
        [0, 2],
      ]);
    },
  );
});
