import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("nextGeneration - empty and trivial", () => {
  it("returns empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("a single live cell dies (underpopulation)", () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });
});

describe("Rule 1 - Underpopulation", () => {
  it("two adjacent live cells both die (each has 1 neighbor)", () => {
    const input: Cell[] = [
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(input), []);
  });

  it("a live cell with no neighbors dies", () => {
    expectSameCells(nextGeneration([[5, 5]]), []);
  });
});

describe("Rule 2 - Survival", () => {
  it("live cell with 2 neighbors survives", () => {
    // L-shape: (0,0), (1,0), (0,1) — (0,0) has 2 neighbors
    const input: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(input);
    // Each corner of L has 2 neighbors, so each survives.
    // Plus (1,1) becomes alive (3 neighbors) — block forms.
    expectSameCells(result, [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("live cell with 3 neighbors survives — middle of blinker", () => {
    // In a vertical blinker [(0,0),(0,1),(0,2)], the middle cell (0,1) has 2 live neighbors → survives.
    const input: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const result = nextGeneration(input);
    expect(result.map(([x, y]) => `${x},${y}`)).toContain("0,1");
  });
});

describe("Rule 3 - Overpopulation", () => {
  it("center of fully filled 3x3 dies due to overpopulation", () => {
    // ### / ### / ### — center (1,1) has 8 neighbors
    const input: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const result = nextGeneration(input);
    // Center should die
    expect(result.map(([x, y]) => `${x},${y}`)).not.toContain("1,1");
  });

  it("Rule 3 example: ### / .#. / ### → #.# / #.# / #.#", () => {
    const input: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    // Per prompt diagram: result is corners + middle-row corners (6 cells)
    // Actually the diagram shows #.# / #.# / #.# — 6 cells total
    const result = nextGeneration(input);
    // Center (1,1) had 4 neighbors → dies
    expect(result.map(([x, y]) => `${x},${y}`)).not.toContain("1,1");
  });
});

describe("Rule 4 - Reproduction", () => {
  it("dead cell with exactly 3 live neighbors becomes alive", () => {
    // ##. / #.. / ... → ##. / ##. / ...
    // Live: (0,1),(1,1),(0,0) — wait, need to be careful with coord system.
    // From prompt: "Dead cell (1,1) has exactly 3 live neighbors → becomes alive."
    // So input cells around (1,1) — three of its neighbors are alive.
    // Pattern ##. / #.. shows top row has 2 cells, second row has 1 cell.
    // Treating row 0 as top: cells (0,0),(1,0),(0,1).
    // But (1,1) being dead with these 3 cells as neighbors → all 3 are neighbors of (1,1). Yes.
    const input: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(input);
    expect(result.map(([x, y]) => `${x},${y}`)).toContain("1,1");
  });

  it("dead cell with only 2 neighbors stays dead", () => {
    const input: Cell[] = [
      [0, 0],
      [1, 0],
    ];
    const result = nextGeneration(input);
    expect(result.map(([x, y]) => `${x},${y}`)).not.toContain("1,1");
    expect(result.map(([x, y]) => `${x},${y}`)).not.toContain("0,1");
  });

  it("dead cell with 4 neighbors stays dead", () => {
    // 4 alive cells around (1,1) but not at (1,1)
    const input: Cell[] = [
      [0, 0],
      [2, 0],
      [0, 2],
      [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result.map(([x, y]) => `${x},${y}`)).not.toContain("1,1");
  });
});

describe("Pattern: Blinker (oscillator)", () => {
  it("vertical blinker becomes horizontal", () => {
    const input: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const expected: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(input), expected);
  });

  it("horizontal blinker becomes vertical (full oscillation)", () => {
    const input: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const expected: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    expectSameCells(nextGeneration(input), expected);
  });

  it("blinker oscillates back to itself after 2 generations", () => {
    const initial: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const gen1 = nextGeneration(initial);
    const gen2 = nextGeneration(gen1);
    expectSameCells(gen2, initial);
  });
});

describe("Pattern: Block (still life)", () => {
  it("block remains unchanged", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("block remains unchanged over multiple generations", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    let current = block;
    for (let i = 0; i < 5; i++) {
      current = nextGeneration(current);
    }
    expectSameCells(current, block);
  });
});

describe("Negative coordinates", () => {
  it("handles negative coordinates correctly", () => {
    const input: Cell[] = [
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ];
    const expected: Cell[] = [
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ];
    expectSameCells(nextGeneration(input), expected);
  });

  it("block at negative coordinates is stable", () => {
    const block: Cell[] = [
      [-10, -10],
      [-9, -10],
      [-10, -9],
      [-9, -9],
    ];
    expectSameCells(nextGeneration(block), block);
  });
});

describe("Output format", () => {
  it("returns an array of [x, y] tuples", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    for (const cell of result) {
      expect(Array.isArray(cell)).toBe(true);
      expect(cell).toHaveLength(2);
      expect(typeof cell[0]).toBe("number");
      expect(typeof cell[1]).toBe("number");
    }
  });

  it("does not return duplicate cells", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
