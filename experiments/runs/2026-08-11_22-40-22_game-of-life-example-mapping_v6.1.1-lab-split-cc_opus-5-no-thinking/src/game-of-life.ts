/** A live cell's position on the infinite grid, as `[x, y]`. */
export type Cell = [number, number];

/**
 * A `Cell` flattened to a string so it can be used as a `Set`/`Map` key —
 * JavaScript keys arrays by identity, so two distinct `[0, 0]` tuples would
 * otherwise never collide.
 */
type CellKey = string;

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;

const fromKey = (key: CellKey): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

/** The eight positions surrounding a cell on the grid. */
const neighborsOf = ([x, y]: Cell): Cell[] => {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
};

/**
 * Tallies, for every cell adjacent to at least one live cell, how many live
 * neighbors it has. Cells with a count of zero are absent, which is exactly
 * the set that can never change state — so this is also the candidate set.
 */
const countLiveNeighbors = (liveCells: Cell[]): Map<CellKey, number> => {
  const counts = new Map<CellKey, number>();
  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = toKey(neighbor);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

/** Fewer live neighbors than this and a live cell dies of underpopulation. */
const MIN_NEIGHBORS_TO_SURVIVE = 2;

/** More live neighbors than this and a live cell dies of overpopulation. */
const MAX_NEIGHBORS_TO_SURVIVE = 3;

/** Exactly this many live neighbors bring a dead cell to life. */
const NEIGHBORS_TO_REPRODUCE = 3;

/**
 * Conway's four rules, stated as they are conventionally named. A live cell
 * dies of underpopulation or overpopulation and otherwise survives; a dead
 * cell is born by reproduction.
 */
const diesOfUnderpopulation = (liveNeighbors: number): boolean =>
  liveNeighbors < MIN_NEIGHBORS_TO_SURVIVE;

const diesOfOverpopulation = (liveNeighbors: number): boolean =>
  liveNeighbors > MAX_NEIGHBORS_TO_SURVIVE;

const survives = (liveNeighbors: number): boolean =>
  !diesOfUnderpopulation(liveNeighbors) && !diesOfOverpopulation(liveNeighbors);

const isBornByReproduction = (liveNeighbors: number): boolean =>
  liveNeighbors === NEIGHBORS_TO_REPRODUCE;

/**
 * Advances the board one generation. The board is represented sparsely: only
 * live cells are listed, so any coordinate absent from `liveCells` is dead.
 */
export function nextGeneration(liveCells: Cell[]): Cell[] {
  const live = new Set(liveCells.map(toKey));

  const nextLiveCells: Cell[] = [];
  for (const [key, liveNeighbors] of countLiveNeighbors(liveCells)) {
    const isAliveNext = live.has(key)
      ? survives(liveNeighbors)
      : isBornByReproduction(liveNeighbors);
    if (isAliveNext) nextLiveCells.push(fromKey(key));
  }

  return nextLiveCells;
}
