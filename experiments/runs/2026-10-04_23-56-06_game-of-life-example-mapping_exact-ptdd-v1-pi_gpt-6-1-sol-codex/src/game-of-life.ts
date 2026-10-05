export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;

function survives(neighbors: number): boolean {
  return neighbors === MIN_SURVIVAL_NEIGHBORS || neighbors === MAX_SURVIVAL_NEIGHBORS;
}

function isBorn(neighbors: number): boolean {
  return neighbors === REPRODUCTION_NEIGHBORS;
}

function neighboringCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
}

function liveNeighborCounts(cells: Iterable<Cell>): Map<string, { cell: Cell; count: number }> {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const cell of cells) {
    for (const neighbor of neighboringCells(cell)) {
      const key = neighbor.join(',');
      const count = (counts.get(key)?.count ?? 0) + 1;
      counts.set(key, { cell: neighbor, count });
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Map(cells.map(cell => [cell.join(','), cell]));
  return [...liveNeighborCounts(living.values()).entries()]
    .filter(([key, { count }]) => living.has(key) ? survives(count) : isBorn(count))
    .map(([, { cell }]) => cell);
}
