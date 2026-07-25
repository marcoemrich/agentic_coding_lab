type Cell = [number, number]; // [x, y]

const key = (x: number, y: number): string => `${x},${y}`;

const neighborOffsets: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

// A cell lives in the next generation when it is born (exactly 3 live
// neighbours) or survives (already alive with 2 live neighbours).
const isAliveNextGeneration = (alive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (alive && liveNeighbors === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of neighborOffsets) {
      const k = key(x + dx, y + dy);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const [x, y] = k.split(",").map(Number) as Cell;
    if (isAliveNextGeneration(living.has(k), count)) {
      result.push([x, y]);
    }
  }

  return result;
}
