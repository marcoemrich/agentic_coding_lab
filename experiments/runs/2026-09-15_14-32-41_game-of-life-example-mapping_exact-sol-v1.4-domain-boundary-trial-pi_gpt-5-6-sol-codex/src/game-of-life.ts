export type Cell = [number, number];

const MINIMUM_OFFSET = -1;
const MAXIMUM_OFFSET = 1;
const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

function cellOf(key: string): Cell {
  const separator = key.indexOf(",");
  return [Number(key.slice(0, separator)), Number(key.slice(separator + 1))];
}

const survives = (liveNeighbors: number): boolean =>
  liveNeighbors === SURVIVAL_NEIGHBORS ||
  liveNeighbors === REPRODUCTION_NEIGHBORS;

const isReproduced = (liveNeighbors: number): boolean =>
  liveNeighbors === REPRODUCTION_NEIGHBORS;

const willLive = (isLiving: boolean, liveNeighbors: number): boolean =>
  isLiving ? survives(liveNeighbors) : isReproduced(liveNeighbors);

function* neighborsOf([x, y]: Cell): Generator<Cell> {
  for (let dx = MINIMUM_OFFSET; dx <= MAXIMUM_OFFSET; dx += 1) {
    for (let dy = MINIMUM_OFFSET; dy <= MAXIMUM_OFFSET; dy += 1) {
      if (dx !== 0 || dy !== 0) yield [x + dx, y + dy];
    }
  }
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, number>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = keyOf(neighbor);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => willLive(living.has(key), count))
    .map(([key]) => cellOf(key));
}
