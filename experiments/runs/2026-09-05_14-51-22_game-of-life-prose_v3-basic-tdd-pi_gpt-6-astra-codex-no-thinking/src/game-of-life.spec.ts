import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual.length).toBe(expected.length);
  expect(new Set(actual.map(cell => JSON.stringify(cell)))).toEqual(
    new Set(expected.map(cell => JSON.stringify(cell))),
  );
}

describe('nextGeneration', () => {
  it('does not mutate input or share output tuples with it', () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const original = cells.map(([x, y]): Cell => [x, y]);
    cells.forEach(Object.freeze);
    Object.freeze(cells);
    const result = nextGeneration(cells);
    expectCells(result, original);
    result[0][0] = 99;
    expect(cells).toEqual(original);
  });

  it('evolves widely separated patterns without a bounded grid', () => {
    const cells: Cell[] = [];
    const expected: Cell[] = [];
    for (const offset of [-1_000_000_000, 1_000_000_000]) {
      cells.push([offset - 1, offset], [offset, offset], [offset + 1, offset]);
      expected.push([offset, offset - 1], [offset, offset], [offset, offset + 1]);
    }
    expectCells(nextGeneration(cells), expected);
  });

  it('moves a glider diagonally after four generations', () => {
    const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    let current = glider;
    for (let step = 0; step < 4; step++) current = nextGeneration(current);
    expectCells(current, glider.map(([x, y]) => [x + 1, y + 1]));
  });

  it('oscillates a blinker over two generations at negative coordinates', () => {
    const horizontal: Cell[] = [[-5, -4], [-4, -4], [-3, -4]];
    const vertical: Cell[] = [[-4, -5], [-4, -4], [-4, -3]];
    expectCells(nextGeneration(horizontal), vertical);
    expectCells(nextGeneration(nextGeneration(horizontal)), horizontal);
  });

  it('treats duplicate coordinates as a single living cell', () => {
    expectCells(nextGeneration([[0, 0], [0, 0], [0, 0]]), []);
  });

  it.each([0, 1, 2, 4, 5, 6, 7, 8])('does not birth a dead cell with %i neighbors', count => {
    const surrounding: Cell[] = [
      [-1, -1], [0, -1], [1, -1], [-1, 0],
      [1, 0], [-1, 1], [0, 1], [1, 1],
    ];
    expect(nextGeneration(surrounding.slice(0, count))).not.toContainEqual([0, 0]);
  });

  it('births dead cells with exactly three neighbors simultaneously', () => {
    expectCells(nextGeneration([[-1, 0], [0, 0], [1, 0]]),
      [[0, -1], [0, 0], [0, 1]]);
  });

  it('kills a live cell with more than three neighbors', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]))
      .not.toContainEqual([0, 0]);
  });

  it('keeps a block stable when each live cell has three neighbors', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('keeps a live cell with two neighbors alive', () => {
    expect(nextGeneration([[-1, -1], [0, 0], [1, 1]])).toContainEqual([0, 0]);
  });

  it('keeps an empty universe empty', () => {
    expectCells(nextGeneration([]), []);
  });

  it('kills an isolated live cell', () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });

  it('kills live cells with only one neighbor', () => {
    expectCells(nextGeneration([[0, 0], [1, 1]]), []);
  });
});
