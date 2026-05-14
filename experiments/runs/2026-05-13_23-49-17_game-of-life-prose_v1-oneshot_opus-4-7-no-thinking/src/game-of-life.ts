export type Cell = readonly [number, number];
export type LiveCells = ReadonlySet<string>;

const KEY_SEP = ",";

export function cellKey(x: number, y: number): string {
  return `${x}${KEY_SEP}${y}`;
}

export function parseKey(key: string): Cell {
  const idx = key.indexOf(KEY_SEP);
  const x = Number(key.slice(0, idx));
  const y = Number(key.slice(idx + 1));
  return [x, y];
}

export function cellsToSet(cells: Iterable<Cell>): Set<string> {
  const set = new Set<string>();
  for (const [x, y] of cells) {
    set.add(cellKey(x, y));
  }
  return set;
}

export function setToCells(set: ReadonlySet<string>): Cell[] {
  const result: Cell[] = [];
  for (const key of set) {
    result.push(parseKey(key));
  }
  return result;
}

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

export function nextGeneration(living: ReadonlySet<string>): Set<string> {
  const neighborCounts = new Map<string, number>();

  for (const key of living) {
    const [x, y] = parseKey(key);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nKey = cellKey(x + dx, y + dy);
      neighborCounts.set(nKey, (neighborCounts.get(nKey) ?? 0) + 1);
    }
  }

  const next = new Set<string>();
  for (const [key, count] of neighborCounts) {
    if (count === 3) {
      next.add(key);
    } else if (count === 2 && living.has(key)) {
      next.add(key);
    }
  }
  return next;
}

export function nextGenerationFromCells(cells: Iterable<Cell>): Cell[] {
  const living = cellsToSet(cells);
  const next = nextGeneration(living);
  return setToCells(next);
}
