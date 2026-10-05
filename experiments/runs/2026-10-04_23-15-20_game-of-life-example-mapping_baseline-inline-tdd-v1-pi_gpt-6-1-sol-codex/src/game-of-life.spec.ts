import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}

describe('nextGeneration', () => {
  it('does not mutate the input or share output coordinate arrays', () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const snapshot = cells.map(([x, y]): Cell => [x, y]);
    cells.forEach(Object.freeze);
    Object.freeze(cells);
    const result = nextGeneration(cells);
    expect(cells).toEqual(snapshot);
    expect(result).not.toBe(cells);
    result[0][0] = 99;
    expect(cells).toEqual(snapshot);
  });

  it('treats duplicate coordinates as a single living cell', () => {
    const cells: Cell[] = [[0, 0], [0, 0], [1, 0], [0, 1], [0, 1]];
    expect(sorted(nextGeneration(cells))).toEqual(sorted([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]));
  });

  it('evolves distant patterns independently without grid boundaries', () => {
    const cells: Cell[] = [
      [-1000000, -1000000], [-1000000, -999999], [-1000000, -999998],
      [1000000, 1000000], [1000001, 1000000], [1000002, 1000000],
    ];
    expect(sorted(nextGeneration(cells))).toEqual(sorted([
      [-1000001, -999999], [-1000000, -999999], [-999999, -999999],
      [1000001, 999999], [1000001, 1000000], [1000001, 1000001],
    ]));
  });

  it.each([0, 1, 2, 4, 5, 6, 7, 8])('does not birth a dead cell with %i neighbors', (count) => {
    const neighbors: Cell[] = [
      [-1, -1], [0, -1], [1, -1], [-1, 0],
      [1, 0], [-1, 1], [0, 1], [1, 1],
    ];
    expect(nextGeneration(neighbors.slice(0, count))).not.toContainEqual([0, 0]);
  });

  it('preserves a block still life without extra births', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it('oscillates a blinker over two generations, including negative x', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const first = nextGeneration(vertical);
    expect(sorted(first)).toEqual([[-1, 1], [0, 1], [1, 1]]);
    expect(sorted(nextGeneration(first))).toEqual(vertical);
  });

  it('births a dead cell with exactly three neighbors', () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(
      sorted([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });

  it.each([4, 5, 6, 7, 8])('kills a live cell with %i neighbors', (count) => {
    const neighbors: Cell[] = [
      [-1, -1], [0, -1], [1, -1], [-1, 0],
      [1, 0], [-1, 1], [0, 1], [1, 1],
    ];
    expect(nextGeneration([[0, 0], ...neighbors.slice(0, count)])).not.toContainEqual([0, 0]);
  });

  it('keeps a live cell with three neighbors alive', () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toContainEqual([0, 0]);
  });

  it('keeps a live cell with two neighbors alive', () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toContainEqual([0, 1]);
  });
  it('keeps an empty grid empty', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a single cell with no neighbors', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills adjacent cells with only one neighbor each', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
});
