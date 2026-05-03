import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

function toSet(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => `${x},${y}`));
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(toSet(actual)).toEqual(toSet(expected));
}

describe('Game of Life - nextGeneration', () => {
  it('returns empty for an empty grid', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('a single live cell dies (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('two live cells die (underpopulation)', () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it('a live cell with 4+ neighbors dies (overpopulation)', () => {
    // Center cell at (0,0) with 4 neighbors
    const live: Cell[] = [
      [0, 0],
      [-1, 0], [1, 0],
      [0, -1], [0, 1],
    ];
    const next = nextGeneration(live);
    // (0,0) should die
    expect(toSet(next).has('0,0')).toBe(false);
  });

  it('a dead cell with exactly 3 live neighbors becomes alive (reproduction)', () => {
    // L-shape, (1,1) has 3 neighbors
    const live: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(live);
    expect(toSet(next).has('1,1')).toBe(true);
  });

  it('block (still life) remains unchanged', () => {
    const block: Cell[] = [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it('blinker oscillates between horizontal and vertical', () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it('handles negative coordinates', () => {
    const block: Cell[] = [
      [-5, -5], [-4, -5],
      [-5, -4], [-4, -4],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it('blinker also works at negative coordinates', () => {
    const horizontal: Cell[] = [[-10, -10], [-9, -10], [-8, -10]];
    const vertical: Cell[] = [[-9, -11], [-9, -10], [-9, -9]];
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it('glider moves diagonally after 4 generations', () => {
    let cells: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    for (let i = 0; i < 4; i++) {
      cells = nextGeneration(cells);
    }
    // After 4 generations, glider has moved by (1, 1)
    const expected: Cell[] = [
      [2, 1],
      [3, 2],
      [1, 3], [2, 3], [3, 3],
    ];
    expectSameCells(cells, expected);
  });

  it('does not duplicate cells in the output', () => {
    const live: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const next = nextGeneration(live);
    const set = toSet(next);
    expect(set.size).toBe(next.length);
  });

  it('treats duplicate input cells as a single live cell', () => {
    const block: Cell[] = [
      [0, 0], [0, 0], [1, 0],
      [0, 1], [1, 1],
    ];
    expectSameCells(nextGeneration(block), [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
    ]);
  });
});
