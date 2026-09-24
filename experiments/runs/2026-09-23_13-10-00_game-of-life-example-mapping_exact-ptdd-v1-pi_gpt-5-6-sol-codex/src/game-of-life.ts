export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS = [-1, 0, 1];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function uniqueLivingCells(cells: Cell[]): Cell[] {
  return [...new Map(cells.map((cell) => [cellKey(cell), cell])).values()];
}

function neighboringCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (const xOffset of NEIGHBOR_OFFSETS) {
    for (const yOffset of NEIGHBOR_OFFSETS) {
      if (xOffset !== 0 || yOffset !== 0) neighbors.push([x + xOffset, y + yOffset]);
    }
  }
  return neighbors;
}

function countLivingNeighbors(cell: Cell, livingKeys: Set<string>): number {
  return neighboringCells(cell).filter((neighbor) => livingKeys.has(cellKey(neighbor))).length;
}

function hasSurvivalNeighborCount(cell: Cell, livingKeys: Set<string>): boolean {
  const neighbors = countLivingNeighbors(cell, livingKeys);
  return neighbors >= MINIMUM_SURVIVAL_NEIGHBORS && neighbors <= MAXIMUM_SURVIVAL_NEIGHBORS;
}

function hasReproductionNeighborCount(cell: Cell, livingKeys: Set<string>): boolean {
  return countLivingNeighbors(cell, livingKeys) === REPRODUCTION_NEIGHBORS;
}

function reproductionCandidates(cells: Cell[], livingKeys: Set<string>): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    for (const neighbor of neighboringCells(cell)) {
      const key = cellKey(neighbor);
      if (!livingKeys.has(key)) candidates.set(key, neighbor);
    }
  }
  return [...candidates.values()].filter((candidate) =>
    hasReproductionNeighborCount(candidate, livingKeys),
  );
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const uniqueCells = uniqueLivingCells(cells);
  const livingKeys = new Set(uniqueCells.map(cellKey));
  const survivors = uniqueCells.filter((cell) => hasSurvivalNeighborCount(cell, livingKeys));
  return [...survivors, ...reproductionCandidates(uniqueCells, livingKeys)];
}
