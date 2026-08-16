export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

const keyOf = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = keyOf(...cell);
      const existingNeighborCount = neighborCounts.get(key);
      neighborCounts.set(key, { cell, count: (existingNeighborCount?.count ?? 0) + 1 });
    }
  }

  const next: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (count === 3 || (count === 2 && liveCellKeys.has(key))) {
      next.push(cell);
    }
  }
  return next.sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
