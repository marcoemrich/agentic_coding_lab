export type Cell = readonly [number, number];

export type LivingCells = ReadonlySet<string>;

export function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function parseCellKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

export function toLivingCells(cells: Iterable<Cell>): Set<string> {
  const result = new Set<string>();
  for (const [x, y] of cells) {
    result.add(cellKey(x, y));
  }
  return result;
}

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

export function nextGeneration(living: LivingCells): Set<string> {
  const neighborCounts = new Map<string, number>();

  for (const key of living) {
    const [x, y] = parseCellKey(key);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = cellKey(x + dx, y + dy);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }

  const next = new Set<string>();
  for (const [key, count] of neighborCounts) {
    const isAlive = living.has(key);
    if (count === 3 || (count === 2 && isAlive)) {
      next.add(key);
    }
  }

  return next;
}

export function nextGenerationFromCells(cells: Iterable<Cell>): Cell[] {
  const living = toLivingCells(cells);
  const next = nextGeneration(living);
  return Array.from(next, parseCellKey);
}
