import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect([...actual].sort(([ax, ay], [bx, by]) => ax - bx || ay - by)).toEqual(
    [...expected].sort(([ax, ay], [bx, by]) => ax - bx || ay - by),
  );
}

describe('nextGeneration', () => {
  it('keeps an empty grid empty', () => {
    expectCells(nextGeneration([]), []);
  });

  it('kills two cells with only one neighbor each', () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });

  it('preserves a live cell with two neighbors', () => {
    expect(nextGeneration([[0, 0], [-1, -1], [1, 1]])).toContainEqual([0, 0]);
  });

  it('preserves a live cell with three neighbors', () => {
    expect(nextGeneration([[0, 0], [-1, -1], [1, 1], [-1, 1]])).toContainEqual([0, 0]);
  });

  it.each([4, 5, 6, 7, 8])('kills a live cell with %i neighbors', (count) => {
    const neighbors: Cell[] = [
      [-1, -1], [0, -1], [1, -1], [-1, 0],
      [1, 0], [-1, 1], [0, 1], [1, 1],
    ];
    expect(nextGeneration([[0, 0], ...neighbors.slice(0, count)])).not.toContainEqual([0, 0]);
  });

  it('creates a live cell with exactly three neighbors, completing a block', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]), [
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });

  it('oscillates a blinker over two generations, including births at negative x', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal = nextGeneration(vertical);
    expectCells(horizontal, [[-1, 1], [0, 1], [1, 1]]);
    expectCells(nextGeneration(horizontal), vertical);
  });

  it('leaves a block still life unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it.each([0, 1, 2, 4, 5, 6, 7, 8])('does not birth a dead cell with %i neighbors', (count) => {
    const neighbors: Cell[] = [
      [-1, -1], [0, -1], [1, -1], [-1, 0],
      [1, 0], [-1, 1], [0, 1], [1, 1],
    ];
    expect(nextGeneration(neighbors.slice(0, count))).not.toContainEqual([0, 0]);
  });

  it('evolves widely separated patterns without grid boundaries', () => {
    const cells: Cell[] = [
      [-1_000_000, -1_000_000], [-1_000_000, -999_999], [-1_000_000, -999_998],
      [1_000_000, 1_000_000], [1_000_001, 1_000_000], [1_000_002, 1_000_000],
    ];
    expectCells(nextGeneration(cells), [
      [-1_000_001, -999_999], [-1_000_000, -999_999], [-999_999, -999_999],
      [1_000_001, 999_999], [1_000_001, 1_000_000], [1_000_001, 1_000_001],
    ]);
  });

  it('treats repeated coordinates as one living cell', () => {
    expectCells(nextGeneration([[0, 0], [0, 0], [1, 0], [0, 1], [0, 1]]), [
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });

  it('does not mutate or reuse input coordinates', () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const original = cells.map(([x, y]): Cell => [x, y]);
    const result = nextGeneration(cells);
    expect(cells).toEqual(original);
    expect(result).not.toBe(cells);
    for (const cell of result) expect(cells).not.toContain(cell);
    result[0][0] = 100;
    expect(cells).toEqual(original);
  });

  it('kills an isolated live cell', () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
});
