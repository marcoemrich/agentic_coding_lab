export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;

function liveNeighborCount(cell: Cell, living: Set<string>): number {
  return neighboringCells(cell).filter(neighbor => living.has(cellKey(neighbor))).length;
}

function survives(neighbors: number): boolean {
  return neighbors === MIN_SURVIVAL_NEIGHBORS || neighbors === MAX_SURVIVAL_NEIGHBORS;
}

function isBorn(neighbors: number): boolean {
  return neighbors === REPRODUCTION_NEIGHBORS;
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

function cellKey(cell: Cell): string {
  return JSON.stringify(cell);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  const survivors = cells.filter(cell => survives(liveNeighborCount(cell, living)));
  const candidates = new Map<string, Cell>();
  for (const cell of cells.flatMap(neighboringCells)) {
    candidates.set(cellKey(cell), cell);
  }
  const births = [...candidates.values()].filter(cell =>
    !living.has(cellKey(cell)) &&
    isBorn(liveNeighborCount(cell, living))
  );
  return [...survivors, ...births];
}
