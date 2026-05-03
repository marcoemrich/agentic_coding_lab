import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

function toSet(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => `${x},${y}`));
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(toSet(actual)).toEqual(toSet(expected));
}

describe('nextGeneration', () => {
  it('returns no living cells when given an empty grid', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a single isolated live cell (underpopulation)', () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });

  it('kills two adjacent live cells (underpopulation)', () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
    ]);
    expect(result).toEqual([]);
  });

  it('keeps a 2x2 block stable (still life)', () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it('rotates a horizontal blinker into vertical orientation', () => {
    const horizontal: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    const vertical: Cell[] = [
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it('rotates a vertical blinker back to horizontal', () => {
    const vertical: Cell[] = [
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    const horizontal: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it('blinker oscillates over two generations', () => {
    const horizontal: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    const afterTwo = nextGeneration(nextGeneration(horizontal));
    expectSameCells(afterTwo, horizontal);
  });

  it('handles negative coordinates correctly', () => {
    const block: Cell[] = [
      [-5, -5],
      [-4, -5],
      [-5, -4],
      [-4, -4],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it('kills a live cell with four or more live neighbors (overpopulation)', () => {
    // Center cell at (0,0) with neighbors at all four sides + corners
    const cells: Cell[] = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const result = nextGeneration(cells);
    const resultSet = toSet(result);
    expect(resultSet.has('0,0')).toBe(false);
  });

  it('births a dead cell with exactly three live neighbors', () => {
    // L-shape: (0,0), (1,0), (0,1) — dead cell (1,1) has three neighbors and should be born
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(cells);
    const resultSet = toSet(result);
    expect(resultSet.has('1,1')).toBe(true);
  });

  it('does not duplicate cells in result', () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expect(result.length).toBe(toSet(result).size);
  });

  it('handles glider pattern correctly', () => {
    // Standard glider
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    // After one generation
    const expectedNext: Cell[] = [
      [0, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [1, 3],
    ];
    expectSameCells(nextGeneration(glider), expectedNext);
  });

  it('handles large coordinate values', () => {
    const block: Cell[] = [
      [1000000, 1000000],
      [1000001, 1000000],
      [1000000, 1000001],
      [1000001, 1000001],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it('does not mutate the input array', () => {
    const input: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    const snapshot = JSON.stringify(input);
    nextGeneration(input);
    expect(JSON.stringify(input)).toBe(snapshot);
  });
});
