import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// Coordinate convention: cells are [x, y]. The spec's only examples that give
// explicit coordinates (blinker, block) are consistent with either vertical
// orientation, so the axis sign is left free; tests below use the spec's own
// coordinate lists wherever it supplies them.
// Cell order is an incidental implementation detail; compare as an unordered collection.
const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("should return [] for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a lone cell (underpopulation, 0 neighbors) — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill both cells of a horizontal pair (underpopulation, 1 neighbor each) — [(0,1), (1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should keep a live cell with exactly 2 neighbors alive (survival)", () => {
    // Blinker: centre (0,1) has exactly 2 live neighbors and survives.
    expect(sortCells(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(
      sortCells([[-1, 1], [0, 1], [1, 1]]),
    );
  });

  it("should keep a live cell with exactly 3 neighbors alive (survival)", () => {
    // Block: every cell has exactly 3 live neighbours, so all four survive.
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual(
      sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });

  it("should kill a live cell with more than 3 neighbors (overpopulation) — centre of \"###\"/\".#.\"/\"###\" dies", () => {
    // Centre (1,1) is alive with 6 live neighbours (> 3), so it dies by overpopulation.
    // Asserts the rule, not the spec's cropped "after" picture, which drops cells
    // born outside its 3x3 frame and miscounts the centre's neighbours as 4.
    const overcrowded: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    expect(nextGeneration(overcrowded)).not.toContainEqual([1, 1]);
  });

  it("should birth a dead cell with exactly 3 neighbors (reproduction) — \"##.\"/\"#..\"/\"...\" births (1,1)", () => {
    // Dead cell (1,1) has exactly 3 live neighbours and is born; the three
    // originals each have 2 neighbours and survive, forming a block.
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(
      sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });

  it("should leave a dead cell with fewer than 3 neighbors dead (no reproduction)", () => {
    // The dead cells (0,1) and (1,1) each have only 2 live neighbours, so neither
    // is born; both live cells have 1 neighbour and die by underpopulation.
    const result = nextGeneration([[0, 0], [1, 0]]);
    expect(result).not.toContainEqual([0, 1]);
    expect(sortCells(result)).toEqual([]);
  });

  it("should keep the block still life unchanged — [(0,0), (1,0), (0,1), (1,1)] -> unchanged", () => {
    // Still-life property: the block maps to itself, generation after generation.
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it("should oscillate the blinker gen 0 -> gen 1 — [(0,0), (0,1), (0,2)] -> [(-1,1), (0,1), (1,1)]", () => {
    // The blinker is an oscillator: each generation it rotates 90 degrees,
    // so the vertical bar becomes a horizontal one about the same centre.
    const verticalBar: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontalBar: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(verticalBar))).toEqual(sortCells(horizontalBar));
  });

  it("should oscillate the blinker gen 1 -> gen 2 — [(-1,1), (0,1), (1,1)] -> [(0,0), (0,1), (0,2)]", () => {
    const verticalBar: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontalBar: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    // Gen 2 is identical to gen 0, so the blinker has period 2.
    expect(sortCells(nextGeneration(horizontalBar))).toEqual(sortCells(verticalBar));
    expect(sortCells(nextGeneration(nextGeneration(verticalBar)))).toEqual(
      sortCells(verticalBar),
    );
  });

  it("should handle a pattern entirely in negative space — block at [(-3,-3), (-2,-3), (-3,-2), (-2,-2)] -> unchanged", () => {
    // The only pattern with BOTH coordinates negative on every cell, so this is
    // what guards the coordinate encode/decode round trip against a naive parse.
    const negativeBlock: Cell[] = [[-3, -3], [-2, -3], [-3, -2], [-2, -2]];
    expect(sortCells(nextGeneration(negativeBlock))).toEqual(sortCells(negativeBlock));
  });

  it("should not return duplicate cells", () => {
    // Each born cell is reached from exactly 3 live neighbours, so an
    // implementation that collected cells without de-duplicating would emit
    // the same coordinate several times. The blinker births two such cells.
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(result).toHaveLength(3);
  });
});
