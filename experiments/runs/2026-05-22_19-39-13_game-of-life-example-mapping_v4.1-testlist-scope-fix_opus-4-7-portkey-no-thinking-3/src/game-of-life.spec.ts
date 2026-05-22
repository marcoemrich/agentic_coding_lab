import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array when given an empty input (no live cells)", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a single isolated live cell — [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill two adjacent live cells with only 1 neighbor each (Rule 1 Underpopulation) — [(0,1), (1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should bring a dead cell with exactly 3 live neighbors to life (Rule 4 Reproduction) — L-shape [(0,2), (1,2), (0,1)] produces square including (1,1)", () => {
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining<Cell>([[0, 2], [1, 2], [0, 1], [1, 1]]));
  });

  it("should keep a live cell alive when it has 3 live neighbors (Rule 2 Survival) — top row ### plus (1,-1) → center (1,1) survives", () => {
    const result = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]]);
    expect(result).toEqual(expect.arrayContaining<Cell>([[1, 1]]));
  });

  it("should kill a live cell with 4 live neighbors (Rule 3 Overpopulation) — full 3x3 minus middle row sides: center (1,1) dies", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toEqual(expect.arrayContaining<Cell>([[1, 1]]));
  });

  it("should keep a 2x2 block unchanged across generations (Block still life) — [(0,0), (1,0), (0,1), (1,1)] stays the same", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining<Cell>([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  it("should oscillate a vertical blinker to a horizontal blinker — [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining<Cell>([[-1, 1], [0, 1], [1, 1]]));
  });

  it("should handle negative coordinates correctly — blinker at negative origin oscillates as expected", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining<Cell>([[-6, -4], [-5, -4], [-4, -4]]));
  });
});
