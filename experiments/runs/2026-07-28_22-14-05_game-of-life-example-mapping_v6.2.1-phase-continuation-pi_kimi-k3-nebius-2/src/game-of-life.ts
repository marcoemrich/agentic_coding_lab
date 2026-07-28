export type Cell = [number, number]; // [x, y]

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function survivesToNextGeneration(
  neighborCount: number,
  isAlive: boolean,
): boolean {
  return neighborCount === 3 || (neighborCount === 2 && isAlive);
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const k = cellKey(cell);
      const entry = neighborCounts.get(k);
      if (entry) {
        entry.count++;
      } else {
        neighborCounts.set(k, { cell, count: 1 });
      }
    }
  }

  return [...neighborCounts.values()]
    .filter(({ cell, count }) =>
      survivesToNextGeneration(count, liveCellKeys.has(cellKey(cell))),
    )
    .map(({ cell }) => cell)
    .sort(([x1, y1], [x2, y2]) => y1 - y2 || x1 - x2);
}
