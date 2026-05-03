import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

const cellSet = (cells: Cell[]): Set<string> =>
  new Set(cells.map(([x, y]) => `${x},${y}`));

const expectSameCells = (actual: Cell[], expected: Cell[]): void => {
  expect(cellSet(actual)).toEqual(cellSet(expected));
};

describe('nextGeneration', () => {
  it('returns no living cells when given an empty grid', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a lone living cell (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills a living cell with only one neighbor (underpopulation)', () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
    ]);
    expect(result).toEqual([]);
  });

  it('keeps a living cell alive with two living neighbors', () => {
    // A blinker (vertical) becomes a horizontal blinker
    const input: Cell[] = [
      [0, -1],
      [0, 0],
      [0, 1],
    ];
    const expected: Cell[] = [
      [-1, 0],
      [0, 0],
      [1, 0],
    ];
    expectSameCells(nextGeneration(input), expected);
  });

  it('keeps a living cell alive with three living neighbors', () => {
    // A 2x2 block is stable - each cell has exactly 3 living neighbors
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it('kills a living cell with more than three living neighbors (overpopulation)', () => {
    // Center cell at (0,0) has 4 neighbors
    const input: Cell[] = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const result = nextGeneration(input);
    const resultSet = cellSet(result);
    // (0,0) should be dead due to overpopulation
    expect(resultSet.has('0,0')).toBe(false);
  });

  it('brings a dead cell to life with exactly three living neighbors', () => {
    // Three cells in an L shape; (1,1) is dead with 3 neighbors and should become alive
    const input: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(input);
    const resultSet = cellSet(result);
    expect(resultSet.has('1,1')).toBe(true);
  });

  it('handles negative coordinates correctly', () => {
    // Blinker centered at negative coordinates
    const input: Cell[] = [
      [-5, -1],
      [-5, 0],
      [-5, 1],
    ];
    const expected: Cell[] = [
      [-6, 0],
      [-5, 0],
      [-4, 0],
    ];
    expectSameCells(nextGeneration(input), expected);
  });

  it('returns the same set for a stable still life (block)', () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expectSameCells(result, block);
  });

  it('correctly evolves a blinker through two generations back to original', () => {
    const vertical: Cell[] = [
      [0, -1],
      [0, 0],
      [0, 1],
    ];
    const horizontal = nextGeneration(vertical);
    const backToVertical = nextGeneration(horizontal);
    expectSameCells(backToVertical, vertical);
  });

  it('does not include dead cells in output', () => {
    const result = nextGeneration([[0, 0]]);
    expect(result.length).toBe(0);
  });

  it('handles a glider pattern correctly', () => {
    // Standard glider
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    // After one generation, the glider becomes:
    const expected: Cell[] = [
      [0, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [1, 3],
    ];
    expectSameCells(nextGeneration(glider), expected);
  });
});
