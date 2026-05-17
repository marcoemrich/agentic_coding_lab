/** A live cell's position as [x, y] coordinates. */
export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (neighborCount: number, wasAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && wasAlive);

/**
 * Computes the next generation of Conway's Game of Life.
 * Returns the set of cells that will be alive in the next tick.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(String));
  const tally = new Map<string, { cell: Cell; count: number }>();

  for (const cell of cells.flatMap(neighborsOf)) {
    const key = String(cell);
    const entry = tally.get(key);
    if (entry) entry.count += 1;
    else tally.set(key, { cell, count: 1 });
  }

  const survivors: Cell[] = [];
  for (const [key, { cell, count }] of tally) {
    if (survives(count, alive.has(key))) survivors.push(cell);
  }
  return survivors;
}
