import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

function toSet(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => `${x},${y}`));
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(toSet(actual)).toEqual(toSet(expected));
}

describe('nextGeneration', () => {
  it('returns no live cells when given an empty set', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('a single live cell dies (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('two live cells with no other neighbors both die', () => {
    expectSameCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it('a live cell with four live neighbors dies (overpopulation)', () => {
    // Center cell at (0,0) has neighbors at (-1,0),(1,0),(0,-1),(0,1)
    const result = nextGeneration([
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]);
    // Center should die from overpopulation
    expect(toSet(result).has('0,0')).toBe(false);
  });

  it('a dead cell with exactly three live neighbors becomes alive (reproduction)', () => {
    // Three cells around (1,0): (0,0),(0,1),(1,1) — (1,0) has 3 neighbors
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [1, 1],
    ]);
    expect(toSet(result).has('1,0')).toBe(true);
  });

  it('a block (2x2) is stable', () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it('a blinker oscillates between horizontal and vertical', () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it('handles negative coordinates', () => {
    const blinker: Cell[] = [[-5, -5], [-4, -5], [-3, -5]];
    const expected: Cell[] = [[-4, -6], [-4, -5], [-4, -4]];
    expectSameCells(nextGeneration(blinker), expected);
  });

  it('a live cell with exactly two live neighbors survives', () => {
    // L-shape at (0,0),(1,0),(0,1) — cell (0,0) has 2 neighbors
    const result = toSet(nextGeneration([[0, 0], [1, 0], [0, 1]]));
    expect(result.has('0,0')).toBe(true);
  });

  it('a live cell with exactly three live neighbors survives', () => {
    // Block: each cell has 3 live neighbors and survives
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it('does not mutate input array', () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const copy = input.map((c) => [...c] as Cell);
    nextGeneration(input);
    expect(input).toEqual(copy);
  });

  it('deduplicates the result (no duplicate cells)', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.length).toBe(toSet(result).size);
  });

  it('handles duplicate input by treating cells as a set', () => {
    // Same cell listed twice should not be counted twice as neighbor
    const result = nextGeneration([[0, 0], [0, 0]]);
    expect(result).toEqual([]);
  });
});
