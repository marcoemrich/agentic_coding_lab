import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life.js';

type Cell = [number, number];

// Helper to compare arrays of cells regardless of order
function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe('nextGeneration', () => {
  it('returns empty array for empty input', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('Rule 1 - Underpopulation: single cell dies', () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it('Rule 1 - Underpopulation: two adjacent cells die', () => {
    // Each cell has only 1 neighbor
    expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
  });

  it('Rule 2 - Survival: cell with 2 neighbors lives on (blinker)', () => {
    // Vertical blinker becomes horizontal
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(gen0), gen1);
  });

  it('Rule 3 - Overpopulation: cell with 4 neighbors dies', () => {
    // Center of a plus-with-corners pattern
    // ###
    // .#.
    // ###
    // Center (1,1) has 4 neighbors at corners → dies
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    // Center should not be in the result
    expect(result.find(([x, y]) => x === 1 && y === 1)).toBeUndefined();
  });

  it('Rule 4 - Reproduction: dead cell with exactly 3 neighbors becomes alive', () => {
    // ##.
    // #..
    // ...
    // Dead cell (1,1) has 3 live neighbors → becomes alive
    const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const result = nextGeneration(gen0);
    expect(result.find(([x, y]) => x === 1 && y === 1)).toBeDefined();
  });

  it('Blinker oscillates', () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    expectSameCells(gen1, [[-1, 1], [0, 1], [1, 1]]);
    const gen2 = nextGeneration(gen1);
    expectSameCells(gen2, gen0);
  });

  it('Block is a still life', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it('handles negative coordinates', () => {
    // Blinker centered at negative coords
    const gen0: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const gen1 = nextGeneration(gen0);
    expectSameCells(gen1, [[-6, -4], [-5, -4], [-4, -4]]);
  });

  it('Reproduction example from prompt', () => {
    // Gen 0:       Gen 1:
    //  ##.          ##.
    //  #..    →     ##.
    //  ...          ...
    // Top row y=2, middle y=1, bottom y=0
    const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const gen1: Cell[] = [[0, 2], [1, 2], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(gen0), gen1);
  });
});
