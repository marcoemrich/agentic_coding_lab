export type Cell = [number, number];

const OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const isAliveNextGen = (wasAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (wasAlive && neighborCount === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const k = keyOf(neighbor);
      const entry = neighborCounts.get(k) ?? { cell: neighbor, count: 0 };
      entry.count++;
      neighborCounts.set(k, entry);
    }
  }

  return Array.from(neighborCounts).flatMap(([k, { cell, count }]) =>
    isAliveNextGen(live.has(k), count) ? [cell] : []
  );
}
