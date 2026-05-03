import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

function toSet(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => `${x},${y}`));
}

function fromResult(cells: Cell[]): Set<string> {
  return toSet(cells);
}

describe('Game of Life', () => {
  it('empty grid stays empty', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('single live cell dies (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('two live cells both die (underpopulation)', () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it('three cells in a row: middle survives, ends die, new cells born', () => {
    // blinker: [[0,0],[1,0],[2,0]] -> [[1,-1],[1,0],[1,1]]
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const resultSet = fromResult(result);
    expect(resultSet).toEqual(toSet([[1, -1], [1, 0], [1, 1]]));
  });

  it('block (2x2) is stable (still life)', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const resultSet = fromResult(result);
    expect(resultSet).toEqual(toSet(block));
  });

  it('cell with exactly 3 neighbors is born', () => {
    // Three cells around a dead cell: that dead cell becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const resultSet = fromResult(result);
    expect(resultSet.has('1,1')).toBe(true);
  });

  it('cell with more than 3 neighbors dies (overpopulation)', () => {
    // Center surrounded by 4+ live cells dies
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1]];
    const result = nextGeneration(cells);
    const resultSet = fromResult(result);
    // [1,1] has neighbors [0,0],[1,0],[2,0],[0,1],[2,1] = 5, so it won't be born
    // [1,0] has neighbors [0,0],[2,0],[0,1],[2,1] = 4, so it dies
    expect(resultSet.has('1,0')).toBe(false);
  });

  it('handles negative coordinates', () => {
    const cells: Cell[] = [[-1, -1], [0, -1], [-1, 0]];
    const result = nextGeneration(cells);
    const resultSet = fromResult(result);
    expect(resultSet.has('0,0')).toBe(true);
  });

  it('blinker oscillates back to original', () => {
    const blinker: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const gen1 = nextGeneration(blinker);
    const gen2 = nextGeneration(gen1);
    expect(fromResult(gen2)).toEqual(toSet(blinker));
  });

  it('glider moves correctly after one generation', () => {
    // Standard glider
    const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    const result = nextGeneration(glider);
    const resultSet = fromResult(result);
    // After one step, glider moves one cell
    const expected: Cell[] = [[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]];
    expect(resultSet).toEqual(toSet(expected));
  });
});
