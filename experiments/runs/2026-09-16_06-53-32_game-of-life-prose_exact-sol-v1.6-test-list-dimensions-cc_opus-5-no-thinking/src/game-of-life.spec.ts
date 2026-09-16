import { describe, expect, it } from "vitest";
import { type Cell, nextGeneration } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life -- nextGeneration", () => {
  // Empty / trivial input
  it("returns no living cells for an empty input -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Rule 1: underpopulation (fewer than two live neighbors)
  it("kills a single isolated living cell with 0 live neighbors -- [[0,0]] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills both cells of a two-cell pair where each has 1 live neighbor -- [[0,0],[1,0]] -> []", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  // Rule 2: survival (exactly two live neighbors)
  it("keeps a living cell with exactly 2 live neighbors alive -- center of blinker [[-1,0],[0,0],[1,0]] survives at [0,0]", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });

  // Rule 2: survival (exactly three live neighbors)
  it("keeps a living cell with exactly 3 live neighbors alive -- every cell of the block [[0,0],[1,0],[0,1],[1,1]] survives", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  // Rule 3: overpopulation (more than three live neighbors)
  it("kills a living cell with 4 live neighbors -- center [1,1] of the plus [[1,0],[0,1],[1,1],[2,1],[1,2]] dies", () => {
    const plus: Cell[] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];

    expect(nextGeneration(plus)).not.toContainEqual([1, 1]);
  });
  it("kills a living cell with more than 4 live neighbors -- center [1,1] of the 3x3 square [[0..2,0..2]] dies with 8 live neighbors", () => {
    const square: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];

    expect(nextGeneration(square)).not.toContainEqual([1, 1]);
  });

  // Rule 4: reproduction (dead cell with exactly three live neighbors)
  it("brings a dead cell with exactly 3 live neighbors to life -- [[0,0],[1,0],[0,1]] produces [1,1]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("leaves a dead cell with exactly 2 live neighbors dead -- [[0,0],[1,0]] produces no cell at [0,1] or [1,1]", () => {
    const result = nextGeneration([[0, 0], [1, 0]]);

    expect(result).not.toContainEqual([0, 1]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("leaves a dead cell with exactly 4 live neighbors dead -- center [1,1] of [[0,0],[2,0],[0,2],[2,2]] stays dead", () => {
    const corners: Cell[] = [[0, 0], [2, 0], [0, 2], [2, 2]];

    expect(nextGeneration(corners)).not.toContainEqual([1, 1]);
  });

  // Neighborhood definition: all eight neighbors, including diagonals
  it("counts diagonal neighbors -- [[0,0],[1,1],[2,2]] keeps [1,1] alive with 2 diagonal neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 1], [2, 2]])).toContainEqual([1, 1]);
  });

  // Negative and mixed-sign coordinates (infinite grid in every direction)
  it("applies all rules unchanged at negative coordinates -- block [[-2,-2],[-1,-2],[-2,-1],[-1,-1]] survives unchanged", () => {
    const block: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("grows into negative coordinates -- blinker [[0,-1],[0,0],[0,1]] becomes [[-1,0],[0,0],[1,0]]", () => {
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];

    expect(sorted(nextGeneration(vertical))).toEqual(
      sorted([[-1, 0], [0, 0], [1, 0]]),
    );
  });
  it("handles cells spanning positive and negative coordinates -- [[-1,0],[0,0],[1,0]] becomes [[0,-1],[0,0],[0,1]]", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];

    expect(sorted(nextGeneration(horizontal))).toEqual(
      sorted([[0, -1], [0, 0], [0, 1]]),
    );
  });

  // Sparse / infinite grid: no bounding-box clamping
  it("creates new cells outside the bounding box of the input -- glider [[1,0],[2,1],[0,2],[1,2],[2,2]] becomes [[0,1],[2,1],[1,2],[2,2],[1,3]]", () => {
    const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];

    expect(sorted(nextGeneration(glider))).toEqual(
      sorted([[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]]),
    );
  });

  // Multi-generation integration
  it("oscillates a blinker back to its original orientation after two generations -- [[-1,0],[0,0],[1,0]] -> vertical -> horizontal", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];

    const afterTwoGenerations = nextGeneration(nextGeneration(horizontal));

    expect(sorted(afterTwoGenerations)).toEqual(sorted(horizontal));
  });

  // Output contract
  it("returns each living cell exactly once even when the input repeats a cell -- duplicate input [[0,0],[0,0],[1,0],[0,1]] yields the same result as the deduplicated input", () => {
    const withDuplicate: Cell[] = [[0, 0], [0, 0], [1, 0], [0, 1]];
    const deduplicated: Cell[] = [[0, 0], [1, 0], [0, 1]];

    expect(sorted(nextGeneration(withDuplicate))).toEqual(
      sorted(nextGeneration(deduplicated)),
    );
  });
  it("does not mutate the input array -- input array and its tuples are unchanged after the call", () => {
    const input: Cell[] = [[-1, 0], [0, 0], [1, 0]];

    nextGeneration(input);

    expect(input).toEqual([[-1, 0], [0, 0], [1, 0]]);
  });
});
