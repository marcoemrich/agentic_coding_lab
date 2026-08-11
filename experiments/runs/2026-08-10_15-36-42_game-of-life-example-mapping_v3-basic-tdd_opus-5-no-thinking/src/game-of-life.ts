export type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

/** A live cell with this many neighbors survives; a dead one stays dead. */
const NEIGHBORS_TO_SURVIVE = 2;
/** This many neighbors keeps a live cell alive and brings a dead one to life. */
const NEIGHBORS_TO_REPRODUCE = 3;

const key = ([x, y]: Cell): string => `${x},${y}`;

const parseKey = (k: string): Cell => {
  const [x, y] = k.split(',').map(Number);
  return [x, y];
};

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

/**
 * Counts, for every cell adjacent to at least one living cell, how many living
 * neighbors it has. Cells with no living neighbors are absent from the map --
 * they can never be born, so the infinite grid stays finite work.
 */
const countLiveNeighbors = (living: Set<string>): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const k of living) {
    for (const neighbor of neighborsOf(parseKey(k))) {
      const nk = key(neighbor);
      counts.set(nk, (counts.get(nk) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(key));
  const survivors: Cell[] = [];

  for (const [k, count] of countLiveNeighbors(living)) {
    const isAlive = living.has(k);
    if (
      count === NEIGHBORS_TO_REPRODUCE ||
      (isAlive && count === NEIGHBORS_TO_SURVIVE)
    ) {
      survivors.push(parseKey(k));
    }
  }

  return survivors;
}
