export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const MAX_SURVIVAL_NEIGHBORS = REPRODUCTION_NEIGHBORS;
const NEIGHBOR_OFFSETS = [-1, 0, 1] as const;

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function isNeighbor([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  const xDistance = Math.abs(x - otherX);
  const yDistance = Math.abs(y - otherY);
  return xDistance <= 1 && yDistance <= 1 && xDistance + yDistance > 0;
}

function candidateCells(livingCells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of livingCells) {
    for (const xOffset of NEIGHBOR_OFFSETS) {
      for (const yOffset of NEIGHBOR_OFFSETS) {
        const candidate: Cell = [x + xOffset, y + yOffset];
        candidates.set(cellKey(candidate), candidate);
      }
    }
  }
  return [...candidates.values()];
}

function countNeighbors(cell: Cell, livingCells: Cell[]): number {
  return livingCells.filter((candidate) => isNeighbor(cell, candidate)).length;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = [...new Map(cells.map((cell) => [cellKey(cell), cell])).values()];
  const livingKeys = new Set(livingCells.map(cellKey));
  return candidateCells(livingCells).filter((cell) => {
    const neighborCount = countNeighbors(cell, livingCells);
    return neighborCount === REPRODUCTION_NEIGHBORS ||
      (livingKeys.has(cellKey(cell)) &&
        neighborCount >= MIN_SURVIVAL_NEIGHBORS &&
        neighborCount <= MAX_SURVIVAL_NEIGHBORS);
  });
}
