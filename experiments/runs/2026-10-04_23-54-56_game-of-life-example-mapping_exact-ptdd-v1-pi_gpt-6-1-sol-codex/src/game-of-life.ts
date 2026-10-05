export type Cell = [number, number];

const SURVIVAL_MINIMUM = 2;
const SURVIVAL_MAXIMUM = 3;
const REPRODUCTION_NEIGHBORS = 3;

function cellKey(cell: Cell): string {
  return JSON.stringify(cell);
}

function liveNeighborCount(cell: Cell, living: Set<string>): number {
  return neighboringCells(cell).filter(neighbor => living.has(cellKey(neighbor))).length;
}

function survives(neighbors: number): boolean {
  return neighbors >= SURVIVAL_MINIMUM && neighbors <= SURVIVAL_MAXIMUM;
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

function generationCandidates(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    for (const candidate of [cell, ...neighboringCells(cell)]) {
      candidates.set(cellKey(candidate), candidate);
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  return generationCandidates(cells).filter(cell => {
    const neighbors = liveNeighborCount(cell, living);
    return living.has(cellKey(cell))
      ? survives(neighbors)
      : isBorn(neighbors);
  });
}
