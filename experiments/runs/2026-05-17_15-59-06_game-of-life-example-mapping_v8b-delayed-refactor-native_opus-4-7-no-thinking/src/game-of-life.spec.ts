import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('nextGeneration - Empty input', () => {
  it('returns empty for empty input', () => {
    expect(nextGeneration([])).toEqual([]);
  });
});

describe('nextGeneration - Rule 1: Underpopulation', () => {
  it('a single cell dies (0 neighbors)', () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it('two adjacent cells both die (1 neighbor each)', () => {
    // From prompt example: [(0,1), (1,1)] → []
    expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
  });

  it('two diagonally-adjacent cells both die (1 neighbor each)', () => {
    expectSameCells(nextGeneration([[0, 0], [1, 1]]), []);
  });
});

describe('nextGeneration - Rule 2: Survival', () => {
  it('a live cell with exactly 2 live neighbors survives', () => {
    // Three in a row horizontally: middle one has 2 neighbors and survives.
    const input: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(input);
    // Middle cell (1,0) survives.
    expect(result.some(([x, y]) => x === 1 && y === 0)).toBe(true);
  });

  it('a live cell with exactly 3 live neighbors survives', () => {
    // L-shape: cell at (0,0) has neighbors at (1,0), (0,1), (1,1).
    const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    // All four block cells have 3 neighbors → all survive.
    expect(result.some(([x, y]) => x === 0 && y === 0)).toBe(true);
  });
});

describe('nextGeneration - Rule 3: Overpopulation', () => {
  it('a live cell with 4 or more live neighbors dies', () => {
    // Center (1,1) surrounded by 4 neighbors at corners.
    const input: Cell[] = [
      [1, 1],
      [0, 0],
      [2, 0],
      [0, 2],
      [2, 2],
    ];
    const result = nextGeneration(input);
    // Center cell (1,1) had 4 neighbors → dies.
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });

  it('a live cell with 8 live neighbors dies', () => {
    const input: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    // (1,1) has 8 neighbors → dies.
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
});

describe('nextGeneration - Rule 4: Reproduction', () => {
  it('a dead cell with exactly 3 live neighbors becomes alive', () => {
    // From prompt example: ##. / #.. → ##. / ##.
    // Cells: [(0,0), (1,0), (0,1)] → (1,1) is dead with 3 neighbors → becomes alive.
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });

  it('a dead cell with 2 live neighbors does not become alive', () => {
    const input: Cell[] = [[0, 0], [2, 0]];
    const result = nextGeneration(input);
    // (1,0) is dead with 2 neighbors → stays dead.
    expect(result.some(([x, y]) => x === 1 && y === 0)).toBe(false);
  });

  it('a dead cell with 4 live neighbors does not become alive', () => {
    const input: Cell[] = [[0, 0], [2, 0], [0, 2], [2, 2]];
    const result = nextGeneration(input);
    // (1,1) is dead with 4 neighbors → stays dead.
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
});

describe('nextGeneration - Patterns', () => {
  it('blinker oscillates: vertical → horizontal', () => {
    // From prompt: [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]
    expectSameCells(
      nextGeneration([[0, 0], [0, 1], [0, 2]]),
      [[-1, 1], [0, 1], [1, 1]],
    );
  });

  it('blinker oscillates: horizontal → vertical (full period)', () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(gen0));
    expectSameCells(gen2, gen0);
  });

  it('block is a still life (unchanged)', () => {
    // From prompt: [(0,0), (1,0), (0,1), (1,1)] → unchanged
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it('single cell dies', () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });
});

describe('nextGeneration - Negative coordinates', () => {
  it('handles cells at negative coordinates', () => {
    // Blinker centered at (-5, -5)
    const input: Cell[] = [[-5, -6], [-5, -5], [-5, -4]];
    expectSameCells(
      nextGeneration(input),
      [[-6, -5], [-5, -5], [-4, -5]],
    );
  });

  it('handles cells spanning origin', () => {
    const input: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    expectSameCells(
      nextGeneration(input),
      [[0, -1], [0, 0], [0, 1]],
    );
  });
});

describe('nextGeneration - Output properties', () => {
  it('does not contain duplicate cells', () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('handles non-contiguous regions independently', () => {
    // A blinker near origin and a block far away
    const blinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const block: Cell[] = [[100, 100], [101, 100], [100, 101], [101, 101]];
    const result = nextGeneration([...blinker, ...block]);
    expectSameCells(result, [
      [-1, 1], [0, 1], [1, 1],
      [100, 100], [101, 100], [100, 101], [101, 101],
    ]);
  });
});
