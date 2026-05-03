import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

function toSet(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => `${x},${y}`));
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(toSet(actual)).toEqual(toSet(expected));
}

describe('nextGeneration', () => {
  it('returns no living cells when given an empty input', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a single isolated cell (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills two cells without enough neighbors', () => {
    expectSameCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it('keeps a block stable (still life)', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it('oscillates a vertical blinker into a horizontal blinker', () => {
    const vertical: Cell[] = [[1, 0], [1, 1], [1, 2]];
    const horizontal: Cell[] = [[0, 1], [1, 1], [2, 1]];
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it('blinker oscillates back after two generations', () => {
    const vertical: Cell[] = [[1, 0], [1, 1], [1, 2]];
    expectSameCells(nextGeneration(nextGeneration(vertical)), vertical);
  });

  it('reproduces a dead cell with exactly three live neighbors', () => {
    // Three cells in an L; the dead corner should come alive.
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(cells);
    expect(toSet(next).has('1,1')).toBe(true);
  });

  it('kills a live cell with more than three live neighbors (overpopulation)', () => {
    // Center of a plus has 4 live neighbors -> dies
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const next = nextGeneration(cells);
    expect(toSet(next).has('0,0')).toBe(false);
  });

  it('handles negative coordinates', () => {
    const vertical: Cell[] = [[-5, -1], [-5, 0], [-5, 1]];
    const horizontal: Cell[] = [[-6, 0], [-5, 0], [-4, 0]];
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it('does not mutate the input array', () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const snapshot = JSON.stringify(cells);
    nextGeneration(cells);
    expect(JSON.stringify(cells)).toBe(snapshot);
  });

  it('does not return duplicate cells', () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(cells);
    expect(next.length).toBe(toSet(next).size);
  });
});
