export type Cell = [number, number];

const NEIGHBOR_OFFSETS: readonly Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

export function nextGeneration(liveCells: readonly Cell[]): Cell[] {
  const livingCellKeys = new Set(liveCells.map(cellKey));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of liveCells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + offsetX, y + offsetY];
      const key = cellKey(neighbor);
      const current = neighborCounts.get(key);
      neighborCounts.set(key, {
        cell: neighbor,
        count: (current?.count ?? 0) + 1,
      });
    }
  }

  const survivors = liveCells.filter((cell) => {
    const count = neighborCounts.get(cellKey(cell))?.count ?? 0;
    return count === 2 || count === 3;
  });
  const births = [...neighborCounts.entries()]
    .filter(([key, { count }]) => !livingCellKeys.has(key) && count === 3)
    .map(([, { cell }]) => cell);

  return [...survivors, ...births];
}
