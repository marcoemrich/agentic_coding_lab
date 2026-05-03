export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function nextGeneration(livingCells: ReadonlyArray<Cell>): Cell[] {
  const alive = new Set<string>();
  for (const [x, y] of livingCells) {
    alive.add(key(x, y));
  }

  // Count neighbor occurrences for each cell adjacent to a living cell.
  // Any cell that could potentially be alive next generation must be a neighbor
  // of at least one currently living cell (or be a living cell with neighbors).
  const neighborCounts = new Map<string, { x: number; y: number; count: number }>();

  for (const [x, y] of livingCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nx = x + dx;
      const ny = y + dy;
      const k = key(nx, ny);
      const entry = neighborCounts.get(k);
      if (entry === undefined) {
        neighborCounts.set(k, { x: nx, y: ny, count: 1 });
      } else {
        entry.count += 1;
      }
    }
  }

  const result: Cell[] = [];

  for (const { x, y, count } of neighborCounts.values()) {
    const isAlive = alive.has(key(x, y));
    if (isAlive && (count === 2 || count === 3)) {
      result.push([x, y]);
    } else if (!isAlive && count === 3) {
      result.push([x, y]);
    }
  }

  // Edge case: a living cell with zero neighbors won't appear in neighborCounts
  // for itself, but it dies anyway from underpopulation, so no special handling needed.

  return result;
}
