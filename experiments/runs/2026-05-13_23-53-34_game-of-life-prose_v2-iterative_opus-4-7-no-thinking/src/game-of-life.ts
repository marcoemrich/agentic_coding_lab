export type Cell = readonly [number, number];

export type LiveCells = ReadonlySet<string>;

export function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function parseKey(k: string): Cell {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
}

export function toSet(cells: Iterable<Cell>): Set<string> {
  const set = new Set<string>();
  for (const [x, y] of cells) {
    set.add(key(x, y));
  }
  return set;
}

export function fromSet(set: ReadonlySet<string>): Cell[] {
  return Array.from(set, parseKey);
}

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function nextGeneration(living: Iterable<Cell>): Cell[] {
  const liveSet = toSet(living);
  const neighborCounts = new Map<string, number>();

  for (const k of liveSet) {
    const [x, y] = parseKey(k);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nk = key(x + dx, y + dy);
      neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
    }
  }

  const nextSet = new Set<string>();
  for (const [k, count] of neighborCounts) {
    if (count === 3 || (count === 2 && liveSet.has(k))) {
      nextSet.add(k);
    }
  }

  return fromSet(nextSet);
}
