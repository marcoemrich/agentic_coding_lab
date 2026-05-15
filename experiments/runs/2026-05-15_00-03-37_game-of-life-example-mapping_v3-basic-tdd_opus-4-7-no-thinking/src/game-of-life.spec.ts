import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life.js';

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe('nextGeneration', () => {
  it('returns empty array when there are no cells', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('a single cell dies (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('Rule 1 - two adjacent cells die from underpopulation', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('Rule 2 - survival: cell with 2 or 3 neighbors survives', () => {
    // Block - still life
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it('Rule 3 - overpopulation: cell with > 3 neighbors dies', () => {
    // Center cell with 4 live neighbors dies. Build a pattern where the center
    // has exactly 4 neighbors. E.g. a plus + one corner:
    //  .#.
    //  ###
    //  #..
    // Center (1,1) has neighbors at (0,1),(2,1),(1,2),(1,0),(0,0) = 5. We'll
    // instead use 4 neighbors:
    //  .#.
    //  ###
    //  .#.
    // Center has 4 → dies.
    const gen0: Cell[] = [
      [1, 2],
      [0, 1], [1, 1], [2, 1],
      [1, 0],
    ];
    const gen1 = nextGeneration(gen0);
    // Center (1,1) dies (overpopulation, 4 neighbors).
    expect(gen1.find(([x, y]) => x === 1 && y === 1)).toBeUndefined();
  });

  it('Rule 4 - reproduction: dead cell with exactly 3 neighbors becomes alive', () => {
    // Gen 0:
    //  ##.
    //  #..
    //  ...
    // Coordinates with y going up: top row is y=2
    const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
    // Expected Gen 1:
    //  ##.
    //  ##.
    //  ...
    const expected: Cell[] = [[0, 2], [1, 2], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(gen0), expected);
  });

  it('Blinker oscillates (vertical → horizontal)', () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1Expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(gen0), gen1Expected);
  });

  it('Blinker oscillates back (horizontal → vertical)', () => {
    const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const gen2Expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expectSameCells(nextGeneration(gen1), gen2Expected);
  });

  it('Block is a still life', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it('handles negative coordinates', () => {
    const blinker: Cell[] = [[-10, -10], [-10, -9], [-10, -8]];
    const expected: Cell[] = [[-11, -9], [-10, -9], [-9, -9]];
    expectSameCells(nextGeneration(blinker), expected);
  });

  it('does not mutate the input', () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const snapshot = JSON.parse(JSON.stringify(cells));
    nextGeneration(cells);
    expect(cells).toEqual(snapshot);
  });
});
