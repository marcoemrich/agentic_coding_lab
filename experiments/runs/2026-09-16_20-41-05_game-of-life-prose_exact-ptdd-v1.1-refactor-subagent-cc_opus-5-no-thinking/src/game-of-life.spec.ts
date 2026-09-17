import { describe, expect, it } from "vitest";
import { type Cell, nextGeneration } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life nextGeneration", () => {
  it("returns an empty set of living cells for an empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single living cell at [0,0] dies of underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("a living cell with exactly one living neighbour dies of underpopulation -- [[0,0],[1,0]] yields []", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("a living cell with two living neighbours survives -- the centre [1,0] of the blinker [[0,0],[1,0],[2,0]] stays alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("a living cell with three living neighbours survives -- the corner [0,0] of the block [[0,0],[1,0],[0,1],[1,1]] stays alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toContainEqual([0, 0]);
  });
  it("a living cell with more than three living neighbours dies of overpopulation -- the centre [1,1] of [[1,1],[0,1],[2,1],[1,0],[1,2]] is absent from the next generation", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("a dead cell with exactly three living neighbours becomes alive by reproduction -- [[0,0],[1,0],[0,1]] yields [1,1] alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("a dead cell with exactly two living neighbours stays dead -- [[0,0],[2,0]] yields no cell at [1,0]", () => {
    expect(nextGeneration([[0, 0], [2, 0]])).not.toContainEqual([1, 0]);
  });
  it("a dead cell with four living neighbours stays dead -- [[0,1],[2,1],[1,0],[1,2]] yields no cell at [1,1]", () => {
    expect(nextGeneration([[0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("only the eight surrounding cells count as neighbours -- a cell is not its own neighbour, so the pair [[0,0],[1,0]] dies instead of counting itself as a second neighbour", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).not.toContainEqual([0, 0]);
  });
  it("the blinker oscillates -- horizontal [[0,0],[1,0],[2,0]] becomes vertical [[1,-1],[1,0],[1,1]]", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [2, 0]]))).toEqual(
      sorted([[1, -1], [1, 0], [1, 1]]),
    );
  });
  it("the block is still life -- [[0,0],[1,0],[0,1],[1,1]] is unchanged in the next generation", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual(
      sorted([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
  it("handles negative coordinates -- the blinker at [[-1,-5],[0,-5],[1,-5]] becomes [[0,-6],[0,-5],[0,-4]]", () => {
    expect(sorted(nextGeneration([[-1, -5], [0, -5], [1, -5]]))).toEqual(
      sorted([[0, -6], [0, -5], [0, -4]]),
    );
  });
  it("the grid is unbounded -- a blinker at large coordinates [[1000000,1000000],[1000001,1000000],[1000002,1000000]] oscillates normally", () => {
    expect(
      sorted(nextGeneration([[1000000, 1000000], [1000001, 1000000], [1000002, 1000000]])),
    ).toEqual(sorted([[1000001, 999999], [1000001, 1000000], [1000001, 1000001]]));
  });
  it("the result contains no duplicate cells", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]);
    const distinct = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(distinct.size).toBe(result.length);
  });
  it("the input array is not mutated", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0]];
    nextGeneration(input);
    expect(input).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
  it("the glider [[1,0],[2,1],[0,2],[1,2],[2,2]] becomes [[0,1],[2,1],[1,2],[2,2],[1,3]]", () => {
    expect(sorted(nextGeneration([[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]))).toEqual(
      sorted([[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]]),
    );
  });
});
