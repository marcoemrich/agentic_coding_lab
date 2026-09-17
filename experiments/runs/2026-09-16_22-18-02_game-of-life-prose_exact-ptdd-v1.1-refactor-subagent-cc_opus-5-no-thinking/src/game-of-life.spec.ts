import { describe, expect, it } from "vitest";
import { type Cell, nextGeneration } from "./game-of-life.js";

function asCellSet(cells: Cell[]): Cell[] {
  return [...cells].sort(([x, y], [otherX, otherY]) => x - otherX || y - otherY);
}

describe("Game of Life -- nextGeneration", () => {
  it("returns no living cells for an empty input -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single living cell with zero live neighbors (underpopulation) -- [[0,0]] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills both cells of a living pair, each having one live neighbor (underpopulation) -- [[0,0],[1,0]] -> []", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("keeps a living cell alive when it has exactly two live neighbors -- centre [1,0] of the blinker [[0,0],[1,0],[2,0]] survives", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });

  it("keeps a living cell alive when it has exactly three live neighbors -- every cell of the block [[0,0],[1,0],[0,1],[1,1]] survives, block is still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    const next = nextGeneration(block);

    expect(asCellSet(next)).toEqual(asCellSet(block));
  });

  it("kills a living cell with more than three live neighbors (overpopulation) -- centre [1,1] of [[0,0],[1,0],[2,0],[0,1],[1,1]] dies", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]])).not.toContainEqual([1, 1]);
  });

  it("revives a dead cell with exactly three live neighbors (reproduction) -- [[0,1],[1,1],[2,1]] produces [1,0] and [1,2]", () => {
    const next = nextGeneration([[0, 1], [1, 1], [2, 1]]);

    expect(next).toContainEqual([1, 0]);
    expect(next).toContainEqual([1, 2]);
  });

  it("does not revive a dead cell with two live neighbors -- [[0,0],[2,0]] produces no living cell at [1,0]", () => {
    expect(nextGeneration([[0, 0], [2, 0]])).not.toContainEqual([1, 0]);
  });

  it("does not revive a dead cell with four live neighbors -- [1,1] stays dead for [[0,0],[2,0],[0,2],[2,2]]", () => {
    expect(nextGeneration([[0, 0], [2, 0], [0, 2], [2, 2]])).not.toContainEqual([1, 1]);
  });

  it("computes the full blinker oscillation -- horizontal [[0,1],[1,1],[2,1]] -> vertical [[1,0],[1,1],[1,2]]", () => {
    const next = nextGeneration([[0, 1], [1, 1], [2, 1]]);

    expect(asCellSet(next)).toEqual(asCellSet([[1, 0], [1, 1], [1, 2]]));
  });

  it("handles negative coordinates -- blinker [[-1,-1],[0,-1],[1,-1]] -> [[0,-2],[0,-1],[0,0]]", () => {
    const next = nextGeneration([[-1, -1], [0, -1], [1, -1]]);

    expect(asCellSet(next)).toEqual(asCellSet([[0, -2], [0, -1], [0, 0]]));
  });

  it("returns each living cell only once -- no duplicate coordinates in the output for the glider [[1,0],[2,1],[0,2],[1,2],[2,2]]", () => {
    const next = nextGeneration([[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]);

    const ordered = asCellSet(next);
    const duplicates = ordered.filter(([x, y], index) => {
      const previous = ordered[index - 1];
      return previous !== undefined && previous[0] === x && previous[1] === y;
    });

    expect(duplicates).toEqual([]);
  });

  it("does not mutate the input array -- input for [[0,0],[1,0],[2,0]] is unchanged after the call", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0]];

    nextGeneration(input);

    expect(input).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
});
