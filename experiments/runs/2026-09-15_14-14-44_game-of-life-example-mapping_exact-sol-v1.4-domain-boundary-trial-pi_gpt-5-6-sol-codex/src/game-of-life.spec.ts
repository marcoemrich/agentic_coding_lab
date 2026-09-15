import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const canonical = (cells: Cell[]): string[] =>
  cells.map(([x, y]) => `${x},${y}`).sort();

describe("Game of Life - Next Generation", () => {
  it("an empty generation remains empty -- []", () => {
    expect(canonical(nextGeneration([]))).toEqual([]);
  });
  it("a single live cell dies from underpopulation -- []", () => {
    expect(canonical(nextGeneration([[0, 0]]))).toEqual([]);
  });
  it("two adjacent live cells each have one neighbor and die -- []", () => {
    expect(canonical(nextGeneration([[0, 1], [1, 1]]))).toEqual([]);
  });
  it("a live cell with exactly two neighbors survives -- center remains alive", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0]]);

    expect(canonical(next)).toContain("0,0");
  });
  it("a live cell with exactly three neighbors survives -- center remains alive", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]]);

    expect(canonical(next)).toContain("0,0");
  });
  it("a live cell with four neighbors dies from overpopulation -- center is absent", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);

    expect(canonical(next)).not.toContain("0,0");
  });
  it("a dead cell with exactly three neighbors is reproduced -- triangle becomes a 2x2 block", () => {
    const next = nextGeneration([[0, 1], [1, 1], [0, 0]]);

    expect(canonical(next)).toEqual(["0,0", "0,1", "1,0", "1,1"]);
  });
  it("a vertical blinker becomes a horizontal blinker including negative x coordinates -- [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(canonical(next)).toEqual(["-1,1", "0,1", "1,1"]);
  });
  it("a blinker returns to its initial state after two generations -- [(0,0),(0,1),(0,2)]", () => {
    const initial: Cell[] = [[0, 0], [0, 1], [0, 2]];

    expect(canonical(nextGeneration(nextGeneration(initial)))).toEqual(["0,0", "0,1", "0,2"]);
  });
  it("a 2x2 block is a still life -- [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(canonical(nextGeneration(block))).toEqual(canonical(block));
  });
});
