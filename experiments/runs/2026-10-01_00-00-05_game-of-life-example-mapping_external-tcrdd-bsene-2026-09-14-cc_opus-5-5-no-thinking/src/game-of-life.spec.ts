import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

const expectNext = (gen0: Cell[], gen1: Cell[]) =>
  expect(sorted(nextGeneration(gen0))).toEqual(sorted(gen1));

describe('nextGeneration', () => {
  it('kills a single cell', () => {
    expectNext([[0, 0]], []);
  });

  it('rule 1 – underpopulation: cells with fewer than 2 neighbors die', () => {
    expectNext([[0, 1], [1, 1]], []);
  });

  // The prompt's drawn Gen 1 for rules 2 and 3 contradicts the rules on the
  // infinite grid, so these expectations are derived from the rules themselves.
  it('rule 2 – survival: a cell with 2 or 3 neighbors lives on', () => {
    // (1,0) has 2 neighbors and survives; (0,0) and (2,0) have 1 and die.
    expectNext(
      [[0, 0], [1, 0], [2, 0], [1, 2]],
      [[1, -1], [1, 0], [0, 1], [2, 1]],
    );
  });

  it('rule 3 – overpopulation: a cell with more than 3 neighbors dies', () => {
    // centre (1,1) has 6 neighbors and dies.
    expectNext(
      [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]],
      [[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, -1], [1, 3]],
    );
  });

  it('rule 4 – reproduction: a dead cell with exactly 3 neighbors comes alive', () => {
    expectNext([[0, 0], [1, 0], [0, 1]], [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it('keeps a block unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectNext(block, block);
  });

  it('oscillates a blinker into negative coordinates and back', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectNext(vertical, horizontal);
    expectNext(horizontal, vertical);
  });

  it('works far away in negative space', () => {
    expectNext(
      [[-1000, -1000], [-1000, -999], [-1000, -998]],
      [[-1001, -999], [-1000, -999], [-999, -999]],
    );
  });
});
