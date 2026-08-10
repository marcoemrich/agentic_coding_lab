import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life';

function sorted(cells: [number, number][]): [number, number][] {
  return [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);
}

describe('nextGeneration', () => {
  it('kills a single cell through underpopulation', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills two adjacent cells because each has only one neighbor', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('keeps a block still life unchanged', () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it('oscillates a blinker through survival and reproduction', () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(vertical))).toEqual(sorted(horizontal));
    expect(sorted(nextGeneration(horizontal))).toEqual(sorted(vertical));
  });

  it('kills an overpopulated center cell', () => {
    const crowded: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];

    expect(nextGeneration(crowded)).not.toContainEqual([1, 1]);
  });

  it('reproduces a dead cell with exactly three neighbors', () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];

    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });

  it('supports patterns at negative coordinates', () => {
    const block: [number, number][] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it('does not mutate its input', () => {
    const cells: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const original = cells.map((cell) => [...cell]);

    nextGeneration(cells);

    expect(cells).toEqual(original);
  });

  it('treats duplicate coordinates as one living cell', () => {
    expect(nextGeneration([[0, 0], [0, 0], [1, 0]])).toEqual([]);
  });
});
