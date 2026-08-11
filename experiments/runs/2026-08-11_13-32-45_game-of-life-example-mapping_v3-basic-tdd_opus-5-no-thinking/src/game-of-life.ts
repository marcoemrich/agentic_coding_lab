export type Cell = [number, number];

type CellKey = string;

const NEIGHBOR_OFFSETS: readonly Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;

const fromKey = (key: CellKey): Cell => {
  const [x, y] = key.split(',');
  return [Number(x), Number(y)];
};

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy] as Cell);

/**
 * Counts, for every cell that has at least one living neighbor, how many
 * living neighbors it has. Cells with zero living neighbors are irrelevant:
 * they can neither survive (they would die of underpopulation) nor be born.
 */
const countLivingNeighbors = (living: Set<CellKey>): Map<CellKey, number> => {
  const counts = new Map<CellKey, number>();

  for (const key of living) {
    for (const neighbor of neighborsOf(fromKey(key))) {
      const neighborKey = toKey(neighbor);
      counts.set(neighborKey, (counts.get(neighborKey) ?? 0) + 1);
    }
  }

  return counts;
};

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = 3;

const survives = (neighbors: number): boolean =>
  neighbors >= MIN_NEIGHBORS_TO_SURVIVE && neighbors <= MAX_NEIGHBORS_TO_SURVIVE;

const isBorn = (neighbors: number): boolean =>
  neighbors === NEIGHBORS_TO_BE_BORN;

/**
 * Computes the next generation on a conceptually infinite grid.
 * Only living cells are stored, so negative and arbitrarily large
 * coordinates work without any bounds handling.
 */
export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(toKey));
  const next: Cell[] = [];

  for (const [key, neighbors] of countLivingNeighbors(living)) {
    const alive = living.has(key);

    if (alive ? survives(neighbors) : isBorn(neighbors)) {
      next.push(fromKey(key));
    }
  }

  return next;
}
