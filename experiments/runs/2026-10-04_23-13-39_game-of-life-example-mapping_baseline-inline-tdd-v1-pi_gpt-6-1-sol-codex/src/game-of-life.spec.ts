import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}

function expectGeneration(cells: Cell[], expected: Cell[]): void {
  expect(sorted(nextGeneration(cells))).toEqual(sorted(expected));
}

describe('nextGeneration', () => {
  it('preserves a living cell with two neighbors', () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toContainEqual([0, 1]);
  });

  it('preserves a block whose cells each have three neighbors', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectGeneration(block, block);
  });

  it('kills a living cell with more than three neighbors', () => {
    for (let count = 4; count <= 8; count++) {
      const neighbors: Cell[] = [
        [-1, -1], [0, -1], [1, -1], [-1, 0],
        [1, 0], [-1, 1], [0, 1], [1, 1],
      ];
      expect(nextGeneration([[0, 0], ...neighbors.slice(0, count)]))
        .not.toContainEqual([0, 0]);
    }
  });

  it('creates a living cell with exactly three neighbors', () => {
    expectGeneration([[0, 0], [1, 0], [0, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it('oscillates a blinker over two generations', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectGeneration(vertical, horizontal);
    expectGeneration(nextGeneration(vertical), vertical);
  });

  it('does not create a cell with any neighbor count other than three', () => {
    const neighbors: Cell[] = [
      [-1, -1], [0, -1], [1, -1], [-1, 0],
      [1, 0], [-1, 1], [0, 1], [1, 1],
    ];
    for (const count of [0, 1, 2, 4, 5, 6, 7, 8]) {
      expect(nextGeneration(neighbors.slice(0, count))).not.toContainEqual([0, 0]);
    }
  });

  it('evolves independent patterns at distant positive and negative coordinates', () => {
    const offsets: Cell[] = [[-1_000_000_000, -1_000_000_000], [1_000_000_000, 1_000_000_000]];
    const cells: Cell[] = offsets.flatMap(([x, y]): Cell[] =>
      [[x, y], [x, y + 1], [x, y + 2]]);
    const expected: Cell[] = offsets.flatMap(([x, y]): Cell[] =>
      [[x - 1, y + 1], [x, y + 1], [x + 1, y + 1]]);
    expectGeneration(cells, expected);
  });

  it('treats duplicate coordinates as one living cell', () => {
    expectGeneration([[0, 0], [0, 0], [0, 1], [0, 2], [0, 2]],
      [[-1, 1], [0, 1], [1, 1]]);
  });

  it('does not mutate or share coordinate tuples with the input', () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const original: Cell[] = cells.map(([x, y]) => [x, y]);
    const next = nextGeneration(cells);
    expect(cells).toEqual(original);
    next[0][0] = 100;
    expect(cells).toEqual(original);
  });

  it('keeps an empty grid empty', () => {
    expectGeneration([], []);
  });

  it('kills a single isolated cell', () => {
    expectGeneration([[0, 0]], []);
  });

  it('kills adjacent cells with only one neighbor each', () => {
    expectGeneration([[0, 1], [1, 1]], []);
  });
});
