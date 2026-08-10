import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life';

const ordered = (cells: [number, number][]) =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

const expectGeneration = (
  cells: [number, number][],
  expected: [number, number][],
) => expect(ordered(nextGeneration(cells))).toEqual(ordered(expected));

describe('nextGeneration', () => {
  it('kills a lone cell through underpopulation', () => {
    expectGeneration([[0, 0]], []);
  });

  it('returns an empty generation for an empty generation', () => {
    expectGeneration([], []);
  });

  it('kills two adjacent cells through underpopulation', () => {
    expectGeneration([[0, 1], [1, 1]], []);
  });

  it('preserves a block whose cells have two or three neighbours', () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectGeneration(block, block);
  });

  it('kills an overcrowded live cell', () => {
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];

    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });

  it('creates a dead cell with exactly three live neighbours', () => {
    expectGeneration(
      [[0, 0], [1, 0], [0, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 1]],
    );
  });

  it('oscillates a blinker and handles negative coordinates', () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];

    expectGeneration(vertical, horizontal);
    expectGeneration(horizontal, vertical);
  });

  it('treats duplicate coordinates as one living cell', () => {
    expectGeneration([[0, 0], [0, 0]], []);
  });

  it('supports coordinates far from the origin', () => {
    const block: [number, number][] = [
      [-1_000_000, 1_000_000], [-999_999, 1_000_000],
      [-1_000_000, 1_000_001], [-999_999, 1_000_001],
    ];
    expectGeneration(block, block);
  });
});
