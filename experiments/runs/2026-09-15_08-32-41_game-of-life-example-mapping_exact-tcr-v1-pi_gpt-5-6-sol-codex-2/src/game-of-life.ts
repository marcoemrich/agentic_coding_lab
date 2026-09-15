export type Cell = [number, number];

type NeighborCount = { cell: Cell; count: number };

const NEIGHBOR_OFFSETS = [-1, 0, 1];
const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

function countNeighbors([x, y]: Cell, neighborCounts: Map<string, NeighborCount>): void {
  for (const dx of NEIGHBOR_OFFSETS) {
    for (const dy of NEIGHBOR_OFFSETS) {
      if (dx === 0 && dy === 0) continue;
      const cell: Cell = [x + dx, y + dy];
      const key = cellKey(cell);
      const count = neighborCounts.get(key)?.count ?? 0;
      neighborCounts.set(key, { cell, count: count + 1 });
    }
  }
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, NeighborCount>();
  cells.forEach((cell) => countNeighbors(cell, neighborCounts));

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) => count === REPRODUCTION_NEIGHBORS
      || (count === SURVIVAL_NEIGHBORS && liveCells.has(key)))
    .map(([, { cell }]) => cell)
    .sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
