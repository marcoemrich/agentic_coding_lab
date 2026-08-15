import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Conway's Game of Life next generation", () => {
  it("should kill a single live cell with 0 neighbors by underpopulation — [(0,0)] becomes []", () => {
    const cells: Cell[] = [[0, 0]];

    expect(nextGeneration(cells)).toEqual([]);
  });

  it("should kill two adjacent live cells with 1 neighbor each by underpopulation — [(0,1),(1,1)] becomes []", () => {
    const cells: Cell[] = [
      [0, 1],
      [1, 1],
    ];

    expect(nextGeneration(cells)).toEqual([]);
  });

  it("should preserve a live cell with exactly 2 live neighbors — in vertical [(0,0),(0,1),(0,2)], center (0,1) survives and the next generation is [(-1,1),(0,1),(1,1)]", () => {
    const cells: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    expect(nextGeneration(cells)).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });

  it("should preserve a live cell with exactly 3 live neighbors — [(0,0),(1,0),(0,1),(1,1)] remains [(0,0),(1,0),(0,1),(1,1)]", () => {
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(nextGeneration(cells)).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("should kill a live cell with more than 3 neighbors by overpopulation — in plus [(0,0),(0,1),(1,0),(0,-1),(-1,0)], center (0,0) dies and the next generation is [(-1,-1),(0,-1),(1,-1),(-1,0),(1,0),(-1,1),(0,1),(1,1)]", () => {
    const cells: Cell[] = [
      [0, 0],
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    expect(nextGeneration(cells)).toEqual([
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });

  it("should reproduce a dead cell with exactly 3 live neighbors — [(0,0),(1,0),(0,1)] becomes block [(0,0),(1,0),(0,1),(1,1)] including newborn (1,1)", () => {
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];

    expect(nextGeneration(cells)).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("should keep the 2x2 block still life unchanged — [(0,0),(1,0),(0,1),(1,1)] becomes [(0,0),(1,0),(0,1),(1,1)]", () => {
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(nextGeneration(cells)).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("should evolve a vertical blinker across two generations — [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)] and then returns to [(0,0),(0,1),(0,2)]", () => {
    const cells: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const firstGeneration = nextGeneration(cells);
    const secondGeneration = nextGeneration(firstGeneration);

    expect(firstGeneration).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expect(secondGeneration).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  it("should evolve cells at negative x and y coordinates on the infinite sparse grid — [(-2,-2),(-2,-1),(-2,0)] becomes [(-3,-1),(-2,-1),(-1,-1)]", () => {
    const cells: Cell[] = [
      [-2, -2],
      [-2, -1],
      [-2, 0],
    ];

    expect(nextGeneration(cells)).toEqual([
      [-3, -1],
      [-2, -1],
      [-1, -1],
    ]);
  });
});
