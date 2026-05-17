export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (count: number, wasAlive: boolean): boolean =>
  count === 3 || (count === 2 && wasAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(cellKey));
  const candidates = new Map<string, Cell>();
  const counts = new Map<string, number>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const k = cellKey(neighbor);
      candidates.set(k, neighbor);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }

  return [...candidates]
    .filter(([k, _]) => survives(counts.get(k) ?? 0, alive.has(k)))
    .map(([, cell]) => cell);
}
