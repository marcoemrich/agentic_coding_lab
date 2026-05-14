import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe('nextGeneration', () => {
  it('returns empty for empty input', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a lone cell (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills a cell with only one neighbor', () => {
    expectSameCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it('keeps a block (still life) stable', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it('oscillates a blinker (horizontal -> vertical)', () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it('oscillates a blinker (vertical -> horizontal)', () => {
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it('kills overcrowded cells', () => {
    // center cell has 4 neighbors -> dies
    const cells: Cell[] = [
      [0, 0],
      [1, 0], [-1, 0],
      [0, 1], [0, -1],
    ];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has('0,0')).toBe(false);
  });

  it('births a cell with exactly three live neighbors', () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has('1,1')).toBe(true);
  });

  it('handles negative coordinates', () => {
    const blinker: Cell[] = [[-10, -10], [-9, -10], [-8, -10]];
    const expected: Cell[] = [[-9, -11], [-9, -10], [-9, -9]];
    expectSameCells(nextGeneration(blinker), expected);
  });

  it('advances a glider correctly', () => {
    // standard glider
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const expected: Cell[] = [
      [0, 1], [2, 1],
      [1, 2], [2, 2],
      [1, 3],
    ];
    expectSameCells(nextGeneration(glider), expected);
  });

  it('block remains a block after multiple generations', () => {
    let cells: Cell[] = [[5, 5], [6, 5], [5, 6], [6, 6]];
    for (let i = 0; i < 5; i++) {
      cells = nextGeneration(cells);
    }
    expectSameCells(cells, [[5, 5], [6, 5], [5, 6], [6, 6]]);
  });

  it('blinker returns to original after two generations', () => {
    const blinker: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const next = nextGeneration(blinker);
    const twoLater = nextGeneration(next);
    expectSameCells(twoLater, blinker);
  });

  it('does not mutate the input', () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const snapshot = JSON.stringify(input);
    nextGeneration(input);
    expect(JSON.stringify(input)).toBe(snapshot);
  });
});
