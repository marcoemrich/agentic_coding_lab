import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}

function expectGeneration(cells: Cell[], expected: Cell[]): void {
  expect(sorted(nextGeneration(cells))).toEqual(sorted(expected));
}

describe('nextGeneration', () => {
  it('keeps an empty grid empty', () => {
    expectGeneration([], []);
  });

  it('preserves a live cell with two neighbors', () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toContainEqual([0, 1]);
  });

  it('preserves a live cell with three neighbors (a block still life)', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectGeneration(block, block);
  });

  it.each([4, 5, 6, 7, 8])('kills a live cell with %i neighbors', (count) => {
    const neighbors: Cell[] = [
      [-1, -1], [0, -1], [1, -1], [-1, 0],
      [1, 0], [-1, 1], [0, 1], [1, 1],
    ];
    expect(nextGeneration([[0, 0], ...neighbors.slice(0, count)]))
      .not.toContainEqual([0, 0]);
  });

  it('creates a dead cell with exactly three neighbors', () => {
    expectGeneration([[0, 0], [1, 0], [0, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it('oscillates a blinker over two simultaneous generations', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectGeneration(vertical, horizontal);
    expectGeneration(horizontal, vertical);
  });

  it.each([0, 1, 2, 4, 5, 6, 7, 8])(
    'does not create a dead cell with %i neighbors', (count) => {
      const neighbors: Cell[] = [
        [-1, -1], [0, -1], [1, -1], [-1, 0],
        [1, 0], [-1, 1], [0, 1], [1, 1],
      ];
      expect(nextGeneration(neighbors.slice(0, count))).not.toContainEqual([0, 0]);
    },
  );

  it.each([[-20, -30], [1_000_000_000, -1_000_000_000]])(
    'evolves a blinker translated to (%i, %i)', (x, y) => {
      expectGeneration([[x, y], [x, y + 1], [x, y + 2]],
        [[x - 1, y + 1], [x, y + 1], [x + 1, y + 1]]);
    },
  );

  it('evolves widely separated patterns independently', () => {
    const block: Cell[] = [[-1000000, -1000000], [-999999, -1000000],
      [-1000000, -999999], [-999999, -999999]];
    expectGeneration([...block, [1000000, 0], [1000000, 1], [1000000, 2]],
      [...block, [999999, 1], [1000000, 1], [1000001, 1]]);
  });

  it('counts duplicate coordinates as one living cell', () => {
    expectGeneration([[0, 0], [0, 0]], []);
    expectGeneration([[0, 0], [1, 0], [0, 1], [0, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it('does not mutate or share coordinate tuples with the input', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const snapshot = block.map(([x, y]): Cell => [x, y]);
    block.forEach(Object.freeze);
    Object.freeze(block);
    const next = nextGeneration(block);
    expect(block).toEqual(snapshot);
    next[0][0] = 100;
    expect(block).toEqual(snapshot);
  });

  it('kills an isolated live cell', () => {
    expectGeneration([[0, 0]], []);
  });

  it('kills live cells with only one neighbor', () => {
    expectGeneration([[0, 1], [1, 1]], []);
  });
});
