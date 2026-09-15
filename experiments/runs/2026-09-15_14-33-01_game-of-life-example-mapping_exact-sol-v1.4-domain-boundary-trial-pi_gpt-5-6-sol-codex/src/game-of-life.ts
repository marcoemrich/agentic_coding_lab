export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS = [-1, 0, 1];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighboringCells([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.flatMap((deltaX) =>
    NEIGHBOR_OFFSETS
      .filter((deltaY) => deltaX !== 0 || deltaY !== 0)
      .map((deltaY): Cell => [x + deltaX, y + deltaY]),
  );
}

function countLiveNeighbors(cell: Cell, livingKeys: Set<string>): number {
  return neighboringCells(cell).filter((neighbor) =>
    livingKeys.has(cellKey(neighbor)),
  ).length;
}

function survives(neighborCount: number): boolean {
  return neighborCount >= MINIMUM_SURVIVAL_NEIGHBORS
    && neighborCount <= MAXIMUM_SURVIVAL_NEIGHBORS;
}

function reproduces(neighborCount: number): boolean {
  return neighborCount === REPRODUCTION_NEIGHBORS;
}

function candidateCells(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    candidates.set(cellKey(cell), cell);
    for (const neighbor of neighboringCells(cell)) {
      candidates.set(cellKey(neighbor), neighbor);
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingKeys = new Set(cells.map(cellKey));
  return candidateCells(cells).filter((candidate) => {
    const neighbors = countLiveNeighbors(candidate, livingKeys);
    return livingKeys.has(cellKey(candidate))
      ? survives(neighbors)
      : reproduces(neighbors);
  });
}
