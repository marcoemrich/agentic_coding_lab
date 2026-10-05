export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;

const REPRODUCTION_NEIGHBORS = 3;

function neighboringCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
}

function survives(neighborCount: number): boolean {
  return neighborCount === MIN_SURVIVAL_NEIGHBORS ||
    neighborCount === MAX_SURVIVAL_NEIGHBORS;
}

function isBorn(neighborCount: number): boolean {
  return neighborCount === REPRODUCTION_NEIGHBORS;
}

function countLiveNeighbors(cells: Cell[]): Map<string, { cell: Cell; count: number }> {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const cell of cells) {
    for (const neighbor of neighboringCells(cell)) {
      const key = neighbor.join(',');
      const previous = counts.get(key)?.count ?? 0;
      counts.set(key, { cell: neighbor, count: previous + 1 });
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cell => cell.join(',')));
  const counts = countLiveNeighbors(cells);
  const next: Cell[] = [];
  for (const [key, { cell, count }] of counts) {
    if (living.has(key) ? survives(count) : isBorn(count)) {
      next.push(cell);
    }
  }
  return next;
}
