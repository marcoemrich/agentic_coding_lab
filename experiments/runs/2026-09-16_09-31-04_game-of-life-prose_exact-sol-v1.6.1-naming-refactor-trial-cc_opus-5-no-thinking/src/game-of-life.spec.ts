import { describe, expect, it } from "vitest";
import { type Cell, nextGeneration } from "./game-of-life.js";

describe("Game of Life nextGeneration", () => {
  it("returns an empty set of living cells when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single living cell with 0 live neighbors -- underpopulation, [[0,0]] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills both cells of a living pair, each having 1 live neighbor -- underpopulation, [[0,0],[1,0]] -> []", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("keeps a living cell alive when it has exactly 2 live neighbors -- survival, centre of horizontal triple [[-1,0],[0,0],[1,0]] keeps [0,0]", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps a living cell alive when it has exactly 3 live neighbors -- survival, corner of a 2x2 block [[0,0],[1,0],[0,1],[1,1]] keeps all four", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
  });
  it("kills a living cell with more than 3 live neighbors -- overpopulation, centre of a plus [[0,0],[-1,0],[1,0],[0,-1],[0,1]] dies", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it("revives a dead cell with exactly 3 live neighbors -- reproduction, [[0,0],[1,0],[0,1]] gives birth to [1,1]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("leaves a dead cell with exactly 2 live neighbors dead -- no reproduction, [[-1,0],[0,0],[1,0]] does not revive [-1,1] which has only 2 living neighbors", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).not.toContainEqual([-1, 1]);
  });
  it("leaves a dead cell with 4 live neighbors dead -- no reproduction, dead centre of [[-1,0],[1,0],[0,-1],[0,1]] stays dead", () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it("counts only the eight surrounding cells as neighbors -- a cell two columns away is not a neighbor, [[0,0],[2,0],[4,0]] -> []", () => {
    expect(nextGeneration([[0, 0], [2, 0], [4, 0]])).toEqual([]);
  });
  it("evolves the blinker one step -- horizontal [[-1,0],[0,0],[1,0]] becomes vertical [[0,-1],[0,0],[0,1]]", () => {
    const expected: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const actual = nextGeneration([[-1, 0], [0, 0], [1, 0]]);
    expect(actual).toEqual(expect.arrayContaining(expected));
    expect(actual).toHaveLength(expected.length);
  });
  it("keeps the 2x2 block stable across a generation -- still life [[0,0],[1,0],[0,1],[1,1]] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const actual = nextGeneration(block);
    expect(actual).toEqual(expect.arrayContaining(block));
    expect(actual).toHaveLength(block.length);
  });
  it("handles negative coordinates -- blinker at [[-5,-5],[-4,-5],[-3,-5]] becomes [[-4,-6],[-4,-5],[-4,-4]]", () => {
    const expected: Cell[] = [[-4, -6], [-4, -5], [-4, -4]];
    const actual = nextGeneration([[-5, -5], [-4, -5], [-3, -5]]);
    expect(actual).toEqual(expect.arrayContaining(expected));
    expect(actual).toHaveLength(expected.length);
  });
  it("returns each living cell only once even when several neighbors give birth to it -- no duplicate coordinates in the result", () => {
    const actual = nextGeneration([[-1, 0], [0, 0], [1, 0]]);
    const distinct = new Set(actual.map(([x, y]) => `${x},${y}`));
    expect(distinct.size).toBe(actual.length);
    expect(actual.filter(([x, y]) => x === 0 && y === 1)).toHaveLength(1);
  });
});
