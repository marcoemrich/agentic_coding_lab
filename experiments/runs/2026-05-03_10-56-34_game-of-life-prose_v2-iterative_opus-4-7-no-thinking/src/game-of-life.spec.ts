import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

function setOf(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => `${x},${y}`));
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(setOf(actual)).toEqual(setOf(expected));
}

describe('nextGeneration', () => {
  it('returns no living cells when given an empty input', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a single isolated live cell (underpopulation)', () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it('kills two adjacent live cells (underpopulation)', () => {
    expectSameCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it('keeps a live cell with two live neighbors alive', () => {
    // Blinker (vertical) -> should become horizontal
    const input: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const expected: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    expectSameCells(nextGeneration(input), expected);
  });

  it('blinker oscillates between two states', () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it('block is a still life (stable across generations)', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it('kills a live cell with more than three live neighbors (overpopulation)', () => {
    // Center cell has 4 neighbors
    const input: Cell[] = [
      [0, 0],
      [-1, 0], [1, 0],
      [0, -1], [0, 1],
    ];
    const result = nextGeneration(input);
    // Center cell should be dead now
    expect(setOf(result).has('0,0')).toBe(false);
  });

  it('births a dead cell with exactly three live neighbors', () => {
    // Three cells around (1,0): (0,0), (0,1), (1,1)
    // (1,0) has exactly three live neighbors -> birth
    const input: Cell[] = [[0, 0], [0, 1], [1, 1]];
    const result = setOf(nextGeneration(input));
    expect(result.has('1,0')).toBe(true);
  });

  it('handles negative coordinates correctly', () => {
    // Blinker centered at very negative coordinates
    const input: Cell[] = [[-100, -101], [-100, -100], [-100, -99]];
    const expected: Cell[] = [[-101, -100], [-100, -100], [-99, -100]];
    expectSameCells(nextGeneration(input), expected);
  });

  it('handles duplicate cell entries gracefully', () => {
    // Same blinker but with duplicates
    const input: Cell[] = [[0, -1], [0, 0], [0, 0], [0, 1]];
    const expected: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    expectSameCells(nextGeneration(input), expected);
  });

  it('does not return duplicate cells in output', () => {
    const input: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const result = nextGeneration(input);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('glider moves correctly after one generation', () => {
    // Standard glider
    const input: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const expected: Cell[] = [
      [0, 1], [2, 1],
      [1, 2], [2, 2],
      [1, 3],
    ];
    expectSameCells(nextGeneration(input), expected);
  });
});
