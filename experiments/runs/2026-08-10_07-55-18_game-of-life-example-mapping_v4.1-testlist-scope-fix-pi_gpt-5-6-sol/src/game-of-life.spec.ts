import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Conway's Game of Life next generation", () => {
  it("should accept an empty sparse array and return no living cells — [] becomes []", () => {
    const livingCells: Cell[] = [];

    expect(nextGeneration(livingCells)).toEqual([]);
  });
  it("should apply underpopulation to a cell with 0 neighbors — [(0,0)] becomes []", () => {
    const livingCells: Cell[] = [[0, 0]];

    expect(nextGeneration(livingCells)).toEqual([]);
  });
  it("should apply underpopulation to two adjacent cells with 1 neighbor each — [(0,1),(1,1)] becomes []", () => {
    const livingCells: Cell[] = [[0, 1], [1, 1]];

    expect(nextGeneration(livingCells)).toEqual([]);
  });
  it("should preserve a live center cell with exactly 2 neighbors — in [(-1,0),(0,0),(1,0)], (0,0) remains alive", () => {
    const livingCells: Cell[] = [[-1, 0], [0, 0], [1, 0]];

    expect(nextGeneration(livingCells)).toContainEqual([0, 0]);
  });
  it("should preserve a live center cell with exactly 3 neighbors — with neighbors (-1,0),(0,1),(1,0), center (0,0) remains alive", () => {
    const livingCells: Cell[] = [[-1, 0], [0, 1], [1, 0], [0, 0]];

    expect(nextGeneration(livingCells)).toContainEqual([0, 0]);
  });
  it("should apply reproduction to a dead cell with exactly 3 neighbors — [(0,0),(1,0),(0,1)] becomes the four-cell block [(0,0),(1,0),(0,1),(1,1)] regardless of order", () => {
    const livingCells: Cell[] = [[0, 0], [1, 0], [0, 1]];

    expect(nextGeneration(livingCells)).toEqual(
      expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
    expect(nextGeneration(livingCells)).toHaveLength(4);
  });
  it("should apply overpopulation to a live center cell with 4 neighbors — center (0,0) dies in the five-cell plus pattern", () => {
    const livingCells: Cell[] = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
    const expectedFiveCellPlusNextGeneration: Cell[] = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0], [1, 0],
      [-1, 1], [0, 1], [1, 1],
    ];

    expect(nextGeneration(livingCells)).toEqual(
      expect.arrayContaining(expectedFiveCellPlusNextGeneration),
    );
    expect(nextGeneration(livingCells)).toHaveLength(8);
    expect(nextGeneration(livingCells)).not.toContainEqual([0, 0]);
  });
  it("should keep the block still life unchanged — [(0,0),(1,0),(0,1),(1,1)] returns the same 4 living coordinates regardless of order", () => {
    const livingCells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const expectedBlockStillLife: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(nextGeneration(livingCells)).toEqual(
      expect.arrayContaining(expectedBlockStillLife),
    );
    expect(nextGeneration(livingCells)).toHaveLength(4);
  });
  it("should advance the vertical blinker one generation across negative and positive x coordinates — [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)] regardless of order", () => {
    const livingCells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expectedHorizontalBlinker: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    expect(nextGeneration(livingCells)).toEqual(
      expect.arrayContaining(expectedHorizontalBlinker),
    );
    expect(nextGeneration(livingCells)).toHaveLength(3);
  });
  it("should advance the blinker for two generations — [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)] and then returns to [(0,0),(0,1),(0,2)], regardless of order", () => {
    const livingCells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expectedVerticalBlinker: Cell[] = [[0, 0], [0, 1], [0, 2]];

    const secondGeneration = nextGeneration(nextGeneration(livingCells));

    expect(secondGeneration).toEqual(
      expect.arrayContaining(expectedVerticalBlinker),
    );
    expect(secondGeneration).toHaveLength(3);
  });
  it("should process an arbitrary sparse array across negative and positive x/y without finite-grid boundaries — blocks at [(-10,-10),(-9,-10),(-10,-9),(-9,-9)] and [(9,9),(10,9),(9,10),(10,10)] remain exactly those 8 living cells regardless of order", () => {
    const livingCells: Cell[] = [
      [-10, -10], [-9, -10], [-10, -9], [-9, -9],
      [9, 9], [10, 9], [9, 10], [10, 10],
    ];

    expect(nextGeneration(livingCells)).toEqual(
      expect.arrayContaining(livingCells),
    );
    expect(nextGeneration(livingCells)).toHaveLength(8);
  });
});
