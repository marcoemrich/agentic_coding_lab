export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const livingSet = new Set<string>(livingCells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();
  const positions = new Map<string, Cell>();

  for (const [x, y] of livingCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const k = key(nx, ny);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
      if (!positions.has(k)) {
        positions.set(k, [nx, ny]);
      }
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = livingSet.has(k);
    if ((isAlive && (count === 2 || count === 3)) || (!isAlive && count === 3)) {
      result.push(positions.get(k)!);
    }
  }

  return result;
}
