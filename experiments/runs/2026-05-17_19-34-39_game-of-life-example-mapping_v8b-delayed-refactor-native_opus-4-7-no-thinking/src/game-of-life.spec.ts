import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('nextGeneration - Rule 1: Underpopulation', () => {
  it('kills a live cell with no neighbors', () => {
    const result = nextGeneration([[0, 0]]);
    expectSameCells(result, []);
  });

  it('kills two adjacent cells (each has only 1 neighbor)', () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expectSameCells(result, []);
  });
});

describe('nextGeneration - Rule 2: Survival', () => {
  it('keeps a cell with 2 neighbors alive', () => {
    // Blinker: vertical bar -> horizontal bar; center has 2 neighbors
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen0);
    // The center (0,1) survives
    expect(normalize(result)).toContain('0,1');
  });

  it('keeps a cell with 3 neighbors alive (block still life)', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expectSameCells(result, block);
  });
});

describe('nextGeneration - Rule 3: Overpopulation', () => {
  it('kills a live cell with more than 3 neighbors', () => {
    // Center cell (1,1) has 4 neighbors
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(normalize(result)).not.toContain('1,1');
  });
});

describe('nextGeneration - Rule 4: Reproduction', () => {
  it('brings a dead cell with exactly 3 neighbors to life', () => {
    // (1,1) is dead with 3 live neighbors (0,0),(1,0),(0,1)
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(gen0);
    expect(normalize(result)).toContain('1,1');
  });

  it('does not bring a dead cell with 2 neighbors to life', () => {
    const gen0: Cell[] = [[0, 0], [2, 0]];
    const result = nextGeneration(gen0);
    expect(normalize(result)).not.toContain('1,0');
  });
});

describe('nextGeneration - Patterns', () => {
  it('blinker oscillates vertical to horizontal', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expectedHorizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(vertical), expectedHorizontal);
  });

  it('blinker oscillates back to vertical after two generations', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const afterTwo = nextGeneration(nextGeneration(vertical));
    expectSameCells(afterTwo, vertical);
  });

  it('block still life remains stable', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it('single cell dies', () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it('empty input produces empty output', () => {
    expectSameCells(nextGeneration([]), []);
  });
});

describe('nextGeneration - Negative coordinates', () => {
  it('handles blinker with negative coordinates', () => {
    const vertical: Cell[] = [[-5, -1], [-5, 0], [-5, 1]];
    const expectedHorizontal: Cell[] = [[-6, 0], [-5, 0], [-4, 0]];
    expectSameCells(nextGeneration(vertical), expectedHorizontal);
  });

  it('handles a block at negative coordinates', () => {
    const block: Cell[] = [[-10, -10], [-9, -10], [-10, -9], [-9, -9]];
    expectSameCells(nextGeneration(block), block);
  });
});

describe('nextGeneration - Infinite grid', () => {
  it('handles cells at very large coordinates', () => {
    const block: Cell[] = [
      [1000000, 1000000],
      [1000001, 1000000],
      [1000000, 1000001],
      [1000001, 1000001],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it('treats disjoint regions independently', () => {
    // A block at origin and a single dying cell far away
    const cells: Cell[] = [
      [0, 0], [1, 0], [0, 1], [1, 1],
      [100, 100],
    ];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(cells), expected);
  });
});

describe('nextGeneration - Specific worked example from prompt', () => {
  it('Rule 4 example: L-tromino fills in to form a block', () => {
    // Gen 0: ##.  / #.. -> Gen 1: ##. / ##.
    // (0,0),(1,0) on top row; (0,1) on second row
    // In prompt's display: top-left corner is shown first row.
    // Use coordinate system where y goes down: top row y=0, second row y=1
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(gen0), expected);
  });
});
