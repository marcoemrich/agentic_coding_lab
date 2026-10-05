type Cell = [number, number];
type NeighborCount = { cell: Cell; count: number };

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;

function cellKey(cell: Cell): string {
  return cell.join(",");
}

function neighboringCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (const dx of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      if (dx !== 0 || dy !== 0) neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
}

function liveNeighborCounts(cells: Cell[]): Map<string, NeighborCount> {
  const counts = new Map<string, NeighborCount>();
  for (const cell of cells) {
    for (const neighbor of neighboringCells(cell)) {
      const key = cellKey(neighbor);
      const previous = counts.get(key);
      counts.set(key, { cell: neighbor, count: (previous?.count ?? 0) + 1 });
    }
  }
  return counts;
}

function survives(neighbors: number): boolean {
  return neighbors >= MIN_SURVIVAL_NEIGHBORS && neighbors <= MAX_SURVIVAL_NEIGHBORS;
}

function isBorn(neighbors: number): boolean {
  return neighbors === REPRODUCTION_NEIGHBORS;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  const next: Cell[] = [];
  for (const [key, { cell, count }] of liveNeighborCounts(cells)) {
    if (living.has(key) ? survives(count) : isBorn(count)) {
      next.push(cell);
    }
  }
  return next;
}
