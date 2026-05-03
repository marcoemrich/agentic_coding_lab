export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(k: string): Cell {
  const [xs, ys] = k.split(",");
  return [Number(xs), Number(ys)];
}

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const living = new Set<string>();
  for (const [x, y] of livingCells) {
    living.add(key(x, y));
  }

  // Count live-neighbor counts for every cell that touches a live cell
  const neighborCounts = new Map<string, number>();
  for (const k of living) {
    const [x, y] = parseKey(k);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nk = key(x + dx, y + dy);
      neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    const isAlive = living.has(k);
    if (isAlive && (count === 2 || count === 3)) {
      result.push(parseKey(k));
    } else if (!isAlive && count === 3) {
      result.push(parseKey(k));
    }
  }

  // A live cell with 0 live neighbors won't appear in neighborCounts.
  // It dies anyway (underpopulation), so no need to add it.

  return result;
}
