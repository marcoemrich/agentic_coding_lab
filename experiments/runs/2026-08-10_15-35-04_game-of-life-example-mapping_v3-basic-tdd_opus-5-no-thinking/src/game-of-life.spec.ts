import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const expectCells = (actual: Cell[], expected: Cell[]) => {
  expect(sorted(actual)).toEqual(sorted(expected));
};

describe('nextGeneration', () => {
  it('returns an empty grid for an empty grid', () => {
    expectCells(nextGeneration([]), []);
  });

  it('kills a single cell with no neighbors', () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });

  it('kills cells with fewer than 2 neighbors (underpopulation)', () => {
    expectCells(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
      [],
    );
  });

  it('keeps a live cell with 2 or 3 neighbors alive (survival)', () => {
    // ### with a lone cell below: the middle of the row has 2 live neighbors.
    const gen0: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 2],
    ];
    expect(nextGeneration(gen0)).toContainEqual([1, 0]);
  });

  it('kills a live cell with more than 3 neighbors (overpopulation)', () => {
    // ### / .#. / ### — the center has 8 live neighbors and dies.
    const gen0: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const gen1 = nextGeneration(gen0);
    expect(gen1).not.toContainEqual([1, 1]);
    expectCells(gen1, [
      [1, -1],
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 2],
      [1, 2],
      [2, 2],
      [1, 3],
    ]);
  });

  it('revives a dead cell with exactly 3 neighbors (reproduction)', () => {
    const gen0: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    expectCells(nextGeneration(gen0), [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it('oscillates a blinker', () => {
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const gen1 = nextGeneration(gen0);
    expectCells(gen1, [
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
    expectCells(nextGeneration(gen1), gen0);
  });

  it('leaves a block unchanged', () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectCells(nextGeneration(block), block);
  });

  it('handles negative coordinates', () => {
    const block: Cell[] = [
      [-5, -5],
      [-4, -5],
      [-5, -4],
      [-4, -4],
    ];
    expectCells(nextGeneration(block), block);
  });

  it('ignores duplicate input cells', () => {
    expectCells(
      nextGeneration([
        [0, 0],
        [0, 0],
      ]),
      [],
    );
  });

  it('treats a duplicated cell as a single cell when counting neighbors', () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectCells(nextGeneration([[0, 0], ...block]), block);
  });

  it('does not return duplicate cells', () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
    expect(new Set(result.map(([x, y]) => `${x},${y}`)).size).toBe(result.length);
  });

  it('does not mutate its input', () => {
    const gen0: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    nextGeneration(gen0);
    expectCells(gen0, [
      [0, 0],
      [1, 0],
      [0, 1],
    ]);
  });
});
