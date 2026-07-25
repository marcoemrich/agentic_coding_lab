type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const key = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => key(x, y)));

  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor = key(x + dx, y + dy);
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }

  const next: Cell[] = [];
  for (const [cellKey, neighborCount] of neighborCounts) {
    const [x, y] = cellKey.split(",").map(Number);
    const isAlive = live.has(cellKey);
    const survives = isAlive && (neighborCount === 2 || neighborCount === 3);
    const isBorn = !isAlive && neighborCount === 3;
    if (survives || isBorn) {
      next.push([x, y]);
    }
  }
  return next;
}
