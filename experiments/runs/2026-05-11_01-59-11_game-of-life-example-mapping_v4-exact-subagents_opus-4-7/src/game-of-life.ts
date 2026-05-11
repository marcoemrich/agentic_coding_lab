export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set<string>(cells.map(cellKey));
  const neighborCounts = countNeighbors(cells);

  return Array.from(neighborCounts)
    .filter(([key, { count }]) => cellLivesNextGeneration(liveSet.has(key), count))
    .map(([, { cell }]) => cell);
}

function countNeighbors(cells: Cell[]): Map<string, { cell: Cell; count: number }> {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      const entry = counts.get(key) ?? { cell: neighbor, count: 0 };
      entry.count += 1;
      counts.set(key, entry);
    }
  }
  return counts;
}

function cellLivesNextGeneration(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === 3 || (isAlive && neighborCount === 2);
}
