export type Cell = [number, number]; // [x, y]

type CellKey = string;

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;

const fromKey = (key: CellKey): Cell => {
  const [x, y] = key.split(',');
  return [Number(x), Number(y)];
};

function* neighborsOf([x, y]: Cell): Generator<Cell> {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) yield [x + dx, y + dy];
    }
  }
}

/**
 * Counts, for every cell that has at least one living neighbor, how many living
 * neighbors it has. Cells with zero living neighbors are irrelevant: they can
 * neither survive (needs 2-3) nor be born (needs exactly 3), which is what keeps
 * the infinite grid tractable.
 */
function countLiveNeighbors(living: Set<CellKey>): Map<CellKey, number> {
  const counts = new Map<CellKey, number>();

  for (const key of living) {
    for (const neighbor of neighborsOf(fromKey(key))) {
      const neighborKey = toKey(neighbor);
      counts.set(neighborKey, (counts.get(neighborKey) ?? 0) + 1);
    }
  }

  return counts;
}

/** A living cell with fewer neighbors dies of underpopulation. */
const MIN_NEIGHBORS_TO_SURVIVE = 2;
/** A living cell with more neighbors dies of overpopulation. */
const MAX_NEIGHBORS_TO_SURVIVE = 3;
/** A dead cell with exactly this many neighbors is born. */
const NEIGHBORS_TO_REPRODUCE = 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(toKey));
  const next: Cell[] = [];

  for (const [key, liveNeighbors] of countLiveNeighbors(living)) {
    const isAlive = living.has(key);
    const survives =
      isAlive &&
      liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
      liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE;
    const isBorn = !isAlive && liveNeighbors === NEIGHBORS_TO_REPRODUCE;

    if (survives || isBorn) next.push(fromKey(key));
  }

  return next;
}
