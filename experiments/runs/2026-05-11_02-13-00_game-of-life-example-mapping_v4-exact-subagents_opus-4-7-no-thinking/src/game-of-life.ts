export type Cell = { x: number; y: number };

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = (x: number, y: number) => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map((c) => keyOf(c.x, c.y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const cell of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = { x: cell.x + dx, y: cell.y + dy };
      const k = keyOf(neighbor.x, neighbor.y);
      const entry = neighborCounts.get(k);
      neighborCounts.set(k, { cell: neighbor, count: (entry?.count ?? 0) + 1 });
    }
  }

  const survives = (k: string, count: number) =>
    aliveKeys.has(k) ? count === 2 || count === 3 : count === 3;

  const result: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (survives(k, count)) result.push(cell);
  }
  return result;
}
