export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const key = (x: number, y: number) => `${x},${y}`;
  const alive = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, { x: number; y: number; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const k = key(nx, ny);
      const entry = neighborCounts.get(k);
      if (entry) entry.count++;
      else neighborCounts.set(k, { x: nx, y: ny, count: 1 });
    }
  }
  const nextLiving: Cell[] = [];
  for (const { x, y, count } of neighborCounts.values()) {
    const wasAlive = alive.has(key(x, y));
    const survives = wasAlive && (count === 2 || count === 3);
    const isBorn = !wasAlive && count === 3;
    if (survives || isBorn) nextLiving.push([x, y]);
  }
  return nextLiving;
}
