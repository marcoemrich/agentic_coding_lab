export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

type NeighborEntry = { cell: Cell; count: number };

function tallyNeighbors(cells: Cell[]): Map<string, NeighborEntry> {
  const tally = new Map<string, NeighborEntry>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = keyOf(neighbor);
      const entry = tally.get(key);
      if (entry) entry.count++;
      else tally.set(key, { cell: neighbor, count: 1 });
    }
  }
  return tally;
}

function survives(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === 3 || (isAlive && neighborCount === 2);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(keyOf));
  return [...tallyNeighbors(cells)]
    .filter(([key, { count }]) => survives(alive.has(key), count))
    .map(([, { cell }]) => cell);
}
