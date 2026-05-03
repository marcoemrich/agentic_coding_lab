import { describe, it, expect } from 'vitest';
import { nextGeneration, key, type Cell } from './game-of-life.js';

function toSet(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => key(x, y)));
}

describe('Game of Life', () => {
  it('empty grid stays empty', () => {
    expect(nextGeneration([])).toEqual(new Set());
  });

  it('single living cell dies of underpopulation', () => {
    expect(nextGeneration([[0, 0]])).toEqual(new Set());
  });

  it('two adjacent cells both die of underpopulation', () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual(new Set());
  });

  it('block (2x2) is stable', () => {
    const block: Cell[] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(nextGeneration(block)).toEqual(toSet(block));
  });

  it('blinker oscillates between horizontal and vertical', () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expect(nextGeneration(horizontal)).toEqual(toSet(vertical));
    expect(nextGeneration(vertical)).toEqual(toSet(horizontal));
  });

  it('dead cell with exactly 3 live neighbors becomes alive', () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result.has(key(1, 1))).toBe(true);
  });

  it('living cell with 4 live neighbors dies of overpopulation', () => {
    // Center cell at (0,0) has 4 neighbors => dies
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const result = nextGeneration(cells);
    expect(result.has(key(0, 0))).toBe(false);
  });

  it('handles negative coordinates', () => {
    const block: Cell[] = [[-5, -5], [-5, -4], [-4, -5], [-4, -4]];
    expect(nextGeneration(block)).toEqual(toSet(block));
  });

  it('handles large coordinates', () => {
    const block: Cell[] = [
      [1_000_000, 1_000_000],
      [1_000_000, 1_000_001],
      [1_000_001, 1_000_000],
      [1_000_001, 1_000_001],
    ];
    expect(nextGeneration(block)).toEqual(toSet(block));
  });

  it('glider moves diagonally after 4 generations', () => {
    let cells: Set<string> = toSet([
      [1, 0], [2, 1], [0, 2], [1, 2], [2, 2],
    ]);
    for (let i = 0; i < 4; i++) {
      const arr: Cell[] = [];
      for (const k of cells) {
        const [xs, ys] = k.split(',');
        arr.push([Number(xs), Number(ys)]);
      }
      cells = nextGeneration(arr);
    }
    // After 4 generations, glider shifts by (1,1)
    const expected = toSet([
      [2, 1], [3, 2], [1, 3], [2, 3], [3, 3],
    ]);
    expect(cells).toEqual(expected);
  });

  it('does not mutate the input', () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const copy = input.map(c => [...c] as Cell);
    nextGeneration(input);
    expect(input).toEqual(copy);
  });

  it('accepts a Set of cells as input via iterable', () => {
    const set = new Set<Cell>([[0, 0], [1, 0], [2, 0]]);
    const result = nextGeneration(set);
    expect(result).toEqual(toSet([[1, -1], [1, 0], [1, 1]]));
  });
});
