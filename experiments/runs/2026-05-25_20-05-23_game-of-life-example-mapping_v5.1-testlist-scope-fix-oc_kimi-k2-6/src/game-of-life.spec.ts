import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation with 0 neighbors) -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation with 1 neighbor each) -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block stable (survival with 3 neighbors) -- same 4 cells", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as Cell[];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("should birth a dead cell with exactly 3 neighbors (reproduction) -- L-shape becomes 4-cell block", () => {
    const lShape = [[0, 0], [1, 0], [0, 1]] as Cell[];
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as Cell[];
    expect(nextGeneration(lShape)).toEqual(block);
  });
  it("should transform vertical blinker to horizontal (center with 2 neighbors survives) -- [(-1,1), (0,1), (1,1)]", () => {
    const verticalBlinker = [[0, 0], [0, 1], [0, 2]] as Cell[];
    const horizontalBlinker = [[-1, 1], [0, 1], [1, 1]] as Cell[];
    expect(nextGeneration(verticalBlinker)).toEqual(horizontalBlinker);
  });
  it("should kill a cell with 4 neighbors (overpopulation)", () => {
    const tShape = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]] as Cell[];
    expect(nextGeneration(tShape)).toEqual([[0, 0], [2, 0], [0, 1], [1, -1], [2, 1]]);
  });
  it("should oscillate blinker over two generations", () => {
    const vertical = [[0, 0], [0, 1], [0, 2]] as Cell[];
    const horizontal = [[-1, 1], [0, 1], [1, 1]] as Cell[];
    expect(nextGeneration(vertical)).toEqual(horizontal);
    expect(nextGeneration(horizontal)).toEqual(vertical);
  });
  it("should handle negative coordinates correctly -- block in negative quadrant remains stable", () => {
    const negBlock = [[-1, -1], [0, -1], [-1, 0], [0, 0]] as Cell[];
    expect(nextGeneration(negBlock)).toEqual(negBlock);
  });
});
