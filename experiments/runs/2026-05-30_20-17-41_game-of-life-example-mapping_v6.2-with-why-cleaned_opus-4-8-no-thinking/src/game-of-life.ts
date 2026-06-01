type Cell = [number, number]; // [x, y]

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const isAliveNextGeneration = (alive: boolean, neighbors: number): boolean =>
  neighbors === 3 || (alive && neighbors === 2);

const liveNeighborCounts = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = toKey([x + dx, y + dy]);
      counts.set(neighborKey, (counts.get(neighborKey) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(toKey));

  return [...liveNeighborCounts(cells)]
    .filter(([key, count]) => isAliveNextGeneration(living.has(key), count))
    .map(([key]) => fromKey(key));
}
