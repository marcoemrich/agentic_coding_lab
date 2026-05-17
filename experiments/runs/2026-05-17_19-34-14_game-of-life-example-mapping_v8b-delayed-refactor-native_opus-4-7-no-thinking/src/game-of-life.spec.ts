import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("nextGeneration - empty input", () => {
  it("returns empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
});

describe("nextGeneration - Rule 1: Underpopulation", () => {
  it("a single live cell dies", () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it("two adjacent live cells both die (each has 1 neighbor)", () => {
    expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
  });

  it("an isolated cell with zero neighbors dies", () => {
    const cells: Cell[] = [[0, 0], [100, 100]];
    const next = nextGeneration(cells);
    // Both should die — neither has neighbors
    expect(next).toEqual([]);
  });
});

describe("nextGeneration - Rule 2: Survival", () => {
  it("a live cell with 2 neighbors survives", () => {
    // Blinker center: (0,1) has neighbors (0,0) and (0,2)
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.some(([x, y]) => x === 0 && y === 1)).toBe(true);
  });

  it("a live cell with 3 neighbors survives", () => {
    // Use the Rule 2 example from prompt: ### / ... / .#.
    // The center cell (1,1)... wait the example shows (1,0),(1,1),(1,2) top row? Let me re-read
    // Gen 0: row0=###, row1=..., row2=.#. -> using (x,y) where x is col, y is row
    // Cells: (0,0),(1,0),(2,0),(1,2)
    // The "center cell (1,1)" referenced has 3 live neighbors: (0,0),(1,0),(2,0)
    // ...wait (1,1) is dead in gen 0. Let me look at the expected output:
    // Gen 1: .#. / .#. / ... -> cells: (1,0),(1,1)
    // So (1,1) becomes alive (was dead) — that's rule 4 (reproduction)
    // Rule 2 (survival) of (1,0): neighbors are (0,0),(2,0),(1,1)dead... wait (1,1) is dead
    // (1,0) live neighbors: (0,0) yes, (2,0) yes, (1,1) no, (0,1) no, (2,1) no = 2 → survives
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 2]];
    const result = nextGeneration(cells);
    // (1,0) should survive (has 2 neighbors)
    expect(result.some(([x, y]) => x === 1 && y === 0)).toBe(true);
  });
});

describe("nextGeneration - Rule 3: Overpopulation", () => {
  it("a live cell with 4 neighbors dies", () => {
    // Rule 3 example: ###/.#./### — center (1,1) has 4 live neighbors? Actually all 8 surrounding
    // Cells: (0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)
    // Wait: ### top, .#. middle, ### bottom
    // (0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2) — that's 7 cells but actually middle row is .#. so just (1,1)
    // Hmm, but center (1,1) live neighbors are: 8 surrounding cells minus (0,1) and (2,1) which are dead
    // = (0,0),(1,0),(2,0),(0,2),(1,2),(2,2) = 6 neighbors, dies (overpopulation)
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    const result = nextGeneration(cells);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });

  it("a live cell with exactly 4 neighbors dies", () => {
    // Build a config: live cell at (0,0) with exactly 4 live neighbors
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const result = nextGeneration(cells);
    expect(result.some(([x, y]) => x === 0 && y === 0)).toBe(false);
  });
});

describe("nextGeneration - Rule 4: Reproduction", () => {
  it("a dead cell with exactly 3 live neighbors becomes alive", () => {
    // Rule 4 example from prompt: ##. / #.. / ...
    // Gen 0 cells: (0,0),(1,0),(0,1)
    // Dead cell (1,1) has live neighbors (0,0),(1,0),(0,1) = 3 → born
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });

  it("a dead cell with 2 live neighbors stays dead", () => {
    // Two cells: (0,0),(2,0) — dead cell (1,0) has 2 neighbors, stays dead
    const cells: Cell[] = [[0, 0], [2, 0]];
    const result = nextGeneration(cells);
    expect(result.some(([x, y]) => x === 1 && y === 0)).toBe(false);
  });

  it("a dead cell with 4 live neighbors stays dead", () => {
    const cells: Cell[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const result = nextGeneration(cells);
    // (0,0) is dead with 4 neighbors → stays dead
    expect(result.some(([x, y]) => x === 0 && y === 0)).toBe(false);
  });
});

describe("nextGeneration - Pattern: Blinker (oscillator)", () => {
  it("vertical blinker becomes horizontal", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1Expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(gen0), gen1Expected);
  });

  it("horizontal blinker becomes vertical (period 2)", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    const gen2 = nextGeneration(gen1);
    expectSameCells(gen2, gen0);
  });
});

describe("nextGeneration - Pattern: Block (still life)", () => {
  it("block remains unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("block remains unchanged over multiple generations", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    let current = block;
    for (let i = 0; i < 5; i++) {
      current = nextGeneration(current);
    }
    expectSameCells(current, block);
  });
});

describe("nextGeneration - Negative coordinates", () => {
  it("handles negative coordinates correctly", () => {
    // Blinker placed at negative coordinates
    const gen0: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const gen1Expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    expectSameCells(nextGeneration(gen0), gen1Expected);
  });

  it("handles cells spanning negative and positive coordinates", () => {
    // Block straddling origin
    const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    expectSameCells(nextGeneration(block), block);
  });
});

describe("nextGeneration - Output format", () => {
  it("returns an array of [x,y] tuples", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    for (const cell of result) {
      expect(Array.isArray(cell)).toBe(true);
      expect(cell.length).toBe(2);
      expect(typeof cell[0]).toBe("number");
      expect(typeof cell[1]).toBe("number");
    }
  });

  it("does not produce duplicate cells", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("does not mutate input", () => {
    const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const snapshot = JSON.stringify(input);
    nextGeneration(input);
    expect(JSON.stringify(input)).toBe(snapshot);
  });
});

describe("nextGeneration - Glider (moving pattern)", () => {
  it("glider moves correctly after 4 generations", () => {
    // Classic glider — after 4 generations shifts by (1,1)
    const gen0: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    let current = gen0;
    for (let i = 0; i < 4; i++) {
      current = nextGeneration(current);
    }
    const expected: Cell[] = [[2, 1], [3, 2], [1, 3], [2, 3], [3, 3]];
    expectSameCells(current, expected);
  });
});
