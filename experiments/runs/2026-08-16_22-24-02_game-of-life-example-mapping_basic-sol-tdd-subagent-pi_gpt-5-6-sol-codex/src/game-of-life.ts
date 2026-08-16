export type Cell = [number, number];

type CellNeighborCount = { cell: Cell; neighbors: number };

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function cellToKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function countLiveNeighborsByCell(cells: Cell[]): Map<string, CellNeighborCount> {
  const candidates = new Map<string, CellNeighborCount>();
  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + offsetX, y + offsetY];
      const cellKey = cellToKey(cell);
      const neighbors = (candidates.get(cellKey)?.neighbors ?? 0) + 1;
      candidates.set(cellKey, { cell, neighbors });
    }
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellToKey));
  return [...countLiveNeighborsByCell(cells).entries()]
    .filter(([cellKey, { neighbors }]) =>
      neighbors === REPRODUCTION_NEIGHBORS
      || (neighbors === SURVIVAL_NEIGHBORS && living.has(cellKey)),
    )
    .map(([, { cell }]) => cell);
}
