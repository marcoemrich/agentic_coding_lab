import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sorted = (cells: [number, number][]): [number, number][] =>
  [...cells].sort(([xA, yA], [xB, yB]) => xA - xB || yA - yB);

describe("Game of Life - next generation", () => {
  it("single live cell dies from underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells each die with one neighbor -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with exactly two neighbors survives", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("live center cell with exactly three neighbors survives", () => {
    const generation = [[0, 0], [-1, 0], [1, 0], [0, 1]] as [number, number][];
    expect(nextGeneration(generation)).toContainEqual([0, 0]);
  });
  it("live center cell with exactly four neighbors dies from overpopulation", () => {
    const generation = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]] as [number, number][];
    expect(nextGeneration(generation)).not.toContainEqual([0, 0]);
  });
  it("dead cell with exactly three neighbors is reproduced -- [(0,0), (0,1), (1,0), (1,1)]", () => {
    const generation = [[0, 1], [1, 1], [0, 0]] as [number, number][];
    expect(sorted(nextGeneration(generation))).toEqual(sorted([[0, 0], [0, 1], [1, 0], [1, 1]]));
  });
  it("block still life is unchanged -- [(0,0), (0,1), (1,0), (1,1)]", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("vertical blinker becomes horizontal -- [(-1,1), (0,1), (1,1)]", () => {
    const vertical = [[0, 0], [0, 1], [0, 2]] as [number, number][];
    expect(sorted(nextGeneration(vertical))).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("horizontal blinker returns to vertical on the second generation -- [(0,0), (0,1), (0,2)]", () => {
    const vertical = [[0, 0], [0, 1], [0, 2]] as [number, number][];
    expect(sorted(nextGeneration(nextGeneration(vertical)))).toEqual(sorted(vertical));
  });
  it("negative coordinates are supported on the infinite grid -- translated blinker across negative x/y", () => {
    const vertical = [[-2, -2], [-2, -1], [-2, 0]] as [number, number][];
    const horizontal = [[-3, -1], [-2, -1], [-1, -1]] as [number, number][];
    expect(sorted(nextGeneration(vertical))).toEqual(sorted(horizontal));
  });
});

