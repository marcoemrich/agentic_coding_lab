export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const survives = (alive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (alive && neighbors === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(keyOf));
  const result: Cell[] = [];
  for (const [key, { cell, count }] of countNeighbors(cells)) {
    if (survives(liveKeys.has(key), count)) result.push(cell);
  }
  return result;
}

type NeighborEntry = { cell: Cell; count: number };

function countNeighbors(cells: Cell[]): Map<string, NeighborEntry> {
  const entries = new Map<string, NeighborEntry>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = keyOf(neighbor);
      const existing = entries.get(key);
      if (existing) {
        existing.count++;
      } else {
        entries.set(key, { cell: neighbor, count: 1 });
      }
    }
  }
  return entries;
}
