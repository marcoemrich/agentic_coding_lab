type Cell = [x: number, y: number];
type CellKey = string;

const toKey = (x: number, y: number): CellKey => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const isAliveNextGeneration = (neighborCount: number, isCurrentlyAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isCurrentlyAlive);

const countNeighbors = (cells: Cell[]): Map<CellKey, { cell: Cell; count: number }> => {
  const counts = new Map<CellKey, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = toKey(neighbor[0], neighbor[1]);
      const existing = counts.get(key);
      counts.set(key, { cell: neighbor, count: (existing?.count ?? 0) + 1 });
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCellKeys = new Set(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = countNeighbors(cells);
  const survivors: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (isAliveNextGeneration(count, liveCellKeys.has(key))) {
      survivors.push(cell);
    }
  }
  return survivors;
}
