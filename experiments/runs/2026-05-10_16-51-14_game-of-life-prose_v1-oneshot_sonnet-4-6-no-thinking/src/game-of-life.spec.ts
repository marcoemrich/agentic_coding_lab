import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

function sortCells(cells: [number, number][]): [number, number][] {
  return [...cells].sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
}

describe('nextGeneration', () => {
  it('returns empty for empty grid', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('single cell dies from underpopulation', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('two cells die from underpopulation', () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it('block (2x2) is stable', () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it('blinker oscillates (horizontal to vertical)', () => {
    const horizontal: [number, number][] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: [number, number][] = [[0, -1], [0, 0], [0, 1]];
    expect(sortCells(nextGeneration(horizontal))).toEqual(sortCells(vertical));
  });

  it('blinker oscillates (vertical to horizontal)', () => {
    const vertical: [number, number][] = [[0, -1], [0, 0], [0, 1]];
    const horizontal: [number, number][] = [[-1, 0], [0, 0], [1, 0]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });

  it('handles negative coordinates', () => {
    const horizontal: [number, number][] = [[-3, -5], [-2, -5], [-1, -5]];
    const vertical: [number, number][] = [[-2, -6], [-2, -5], [-2, -4]];
    expect(sortCells(nextGeneration(horizontal))).toEqual(sortCells(vertical));
  });

  it('dead cell with exactly 3 live neighbors becomes alive', () => {
    // Three cells around [0,0]
    const cells: [number, number][] = [[1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(cells);
    const keys = next.map(([x, y]) => `${x},${y}`);
    expect(keys).toContain('1,1'); // alive with 2 neighbors stays
    expect(keys).toContain('1,0'); // alive with 2 neighbors stays
    expect(keys).toContain('0,1'); // alive with 2 neighbors stays
    expect(keys).toContain('0,0'); // dead with 3 neighbors becomes alive
  });

  it('live cell with more than 3 neighbors dies from overpopulation', () => {
    // Center cell surrounded by 4 live cells
    const cells: [number, number][] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const next = nextGeneration(cells);
    const keys = new Set(next.map(([x, y]) => `${x},${y}`));
    expect(keys.has('0,0')).toBe(false); // dies: 4 neighbors
  });

  it('glider moves correctly after one generation', () => {
    // Standard glider
    const glider: [number, number][] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const expected: [number, number][] = [
      [0, 1],
      [2, 1],
      [1, 2], [2, 2],
      [1, 3],
    ];
    expect(sortCells(nextGeneration(glider))).toEqual(sortCells(expected));
  });
});
