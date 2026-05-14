export type Cell = readonly [number, number];

export type LivingCells = ReadonlySet<string>;

const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
};

export const cellsToSet = (cells: Iterable<Cell>): Set<string> => {
  const set = new Set<string>();
  for (const [x, y] of cells) {
    set.add(key(x, y));
  }
  return set;
};

export const setToCells = (set: LivingCells): Cell[] => {
  const out: Cell[] = [];
  for (const k of set) {
    out.push(parseKey(k));
  }
  return out;
};

const NEIGHBOR_OFFSETS: readonly Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export const nextGeneration = (living: LivingCells): Set<string> => {
  const neighborCounts = new Map<string, number>();

  for (const k of living) {
    const [x, y] = parseKey(k);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nk = key(x + dx, y + dy);
      neighborCounts.set(nk, (neighborCounts.get(nk) ?? 0) + 1);
    }
  }

  const next = new Set<string>();
  for (const [k, count] of neighborCounts) {
    if (count === 3 || (count === 2 && living.has(k))) {
      next.add(k);
    }
  }
  return next;
};

export const nextGenerationCells = (cells: Iterable<Cell>): Cell[] => {
  const set = cellsToSet(cells);
  const nextSet = nextGeneration(set);
  return setToCells(nextSet);
};
