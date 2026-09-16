export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function liveNeighborCount([x, y]: Cell, livingCells: Set<string>): number {
  return NEIGHBOR_OFFSETS.filter(([xOffset, yOffset]) =>
    livingCells.has(cellKey([x + xOffset, y + yOffset])),
  ).length;
}

function survives(liveNeighbors: number): boolean {
  return liveNeighbors >= MINIMUM_SURVIVAL_NEIGHBORS
    && liveNeighbors <= MAXIMUM_SURVIVAL_NEIGHBORS;
}

function willBeAlive(isAlive: boolean, liveNeighbors: number): boolean {
  return isAlive
    ? survives(liveNeighbors)
    : liveNeighbors === REPRODUCTION_NEIGHBORS;
}

function generationCandidates(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    candidates.set(cellKey([x, y]), [x, y]);
    for (const [xOffset, yOffset] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + xOffset, y + yOffset];
      candidates.set(cellKey(neighbor), neighbor);
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  return generationCandidates(cells).filter((cell) => willBeAlive(
    livingCells.has(cellKey(cell)),
    liveNeighborCount(cell, livingCells),
  ));
}
