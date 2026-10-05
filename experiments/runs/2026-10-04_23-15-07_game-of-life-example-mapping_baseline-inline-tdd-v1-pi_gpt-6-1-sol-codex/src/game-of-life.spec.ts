import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe('nextGeneration', () => {
  it('updates simultaneously so a glider moves diagonally after four generations', () => {
    const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    let current = glider;
    for (let generation = 0; generation < 4; generation++) {
      current = nextGeneration(current);
    }
    expectCells(current, glider.map(([x, y]) => [x + 1, y + 1]));
  });

  it('does not mutate input or share coordinate tuples with output', () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const original = input.map(cell => [...cell]);
    input.forEach(Object.freeze);
    Object.freeze(input);
    const result = nextGeneration(input);
    expect(input).toEqual(original);
    result[0][0] = 99;
    expect(input).toEqual(original);
  });

  it('treats duplicate coordinates as one living cell', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1], [0, 0], [1, 0]]),
      [[0, 0], [1, 0], [0, 1], [1, 1]]);
    expectCells(nextGeneration([[0, 0], [0, 0], [0, 0]]), []);
  });

  it('evolves widely separated patterns without finite boundaries', () => {
    const origins: Cell[] = [[-1_000_000_000, -1_000_000_000], [1_000_000_000, 1_000_000_000]];
    const input: Cell[] = origins.flatMap(([x, y]) => [[x, y], [x, y + 1], [x, y + 2]] as Cell[]);
    const expected: Cell[] = origins.flatMap(([x, y]) => [[x - 1, y + 1], [x, y + 1], [x + 1, y + 1]] as Cell[]);
    expectCells(nextGeneration(input), expected);
  });

  it.each([0, 1, 2, 4, 5, 6, 7, 8])('does not birth a dead cell with %i neighbors', count => {
    const surrounding: Cell[] = [
      [-1, -1], [0, -1], [1, -1], [-1, 0],
      [1, 0], [-1, 1], [0, 1], [1, 1],
    ];
    expect(nextGeneration(surrounding.slice(0, count))).not.toContainEqual([0, 0]);
  });

  it('leaves a block still life unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it('rotates a blinker across negative coordinates and back in two generations', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectCells(nextGeneration(vertical), horizontal);
    expectCells(nextGeneration(nextGeneration(vertical)), vertical);
  });

  it('reproduces a dead cell with exactly three neighbors', () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]),
      [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  it.each([4, 5, 6, 7, 8])('kills a live cell with %i neighbors', count => {
    const surrounding: Cell[] = [
      [-1, -1], [0, -1], [1, -1], [-1, 0],
      [1, 0], [-1, 1], [0, 1], [1, 1],
    ];
    expect(nextGeneration([[0, 0], ...surrounding.slice(0, count)]))
      .not.toContainEqual([0, 0]);
  });

  it('keeps a live cell with three neighbors alive, including diagonals', () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]))
      .toContainEqual([1, 1]);
  });

  it('keeps a live cell with two neighbors alive', () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
    expect(result).not.toContainEqual([0, 0]);
    expect(result).not.toContainEqual([0, 2]);
  });

  it('leaves an empty grid empty', () => {
    expectCells(nextGeneration([]), []);
  });

  it('kills two live cells with only one neighbor each', () => {
    expectCells(nextGeneration([[0, 1], [1, 1]]), []);
  });

  it('kills a single live cell with no neighbors', () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });
});
