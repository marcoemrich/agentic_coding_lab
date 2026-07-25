/**
 * A live cell on the infinite grid, represented as `[x, y]` coordinates.
 */
export type Cell = [number, number];

/**
 * The eight (dx, dy) offsets that address a cell's neighbours.
 */
const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

/**
 * Returns true iff a cell should be alive next generation given its
 * live-neighbour count and whether it was alive this generation.
 *
 * Compact encoding of Conway's Game of Life rules:
 *   - A live cell with 2 or 3 neighbours survives.
 *   - A dead cell with exactly 3 neighbours is born.
 *   - All other cells die or stay dead.
 */
const survives = (count: number, wasAlive: boolean): boolean =>
  count === 3 || (count === 2 && wasAlive);

/**
 * Computes the next generation of live cells according to Conway's
 * Game of Life rules:
 *   1. Any live cell with fewer than 2 live neighbours dies (underpopulation).
 *   2. Any live cell with 2 or 3 live neighbours lives on (survival).
 *   3. Any live cell with more than 3 live neighbours dies (overpopulation).
 *   4. Any dead cell with exactly 3 live neighbours becomes alive (reproduction).
 *
 * Equivalently, a cell is alive in the next generation iff it has exactly 3
 * live neighbours, or it was already alive with exactly 2.
 *
 * @param cells The set of live cells in the current generation.
 * @returns The set of live cells in the next generation.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(toKey));
  const counts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of counts) {
    if (survives(count, live.has(key))) {
      next.push(fromKey(key));
    }
  }
  return next;
}
