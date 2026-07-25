export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const toKey = (x: number, y: number): string => `${x},${y}`;

const survivesOrIsBorn = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (isAlive && liveNeighbors === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set<string>(cells.map(([x, y]) => toKey(x, y)));

  const neighborCounts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = toKey(cell[0], cell[1]);
      const existing = neighborCounts.get(key);
      neighborCounts.set(key, { cell, count: (existing?.count ?? 0) + 1 });
    }
  }

  const result: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (survivesOrIsBorn(liveCells.has(key), count)) {
      result.push(cell);
    }
  }
  return result;
}
