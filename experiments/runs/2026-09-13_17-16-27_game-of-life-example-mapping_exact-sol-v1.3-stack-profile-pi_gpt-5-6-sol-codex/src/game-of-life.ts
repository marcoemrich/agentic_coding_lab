export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  const xDistance = Math.abs(x - otherX);
  const yDistance = Math.abs(y - otherY);
  return xDistance <= 1 && yDistance <= 1 && (xDistance !== 0 || yDistance !== 0);
}

function neighboringCells([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([xOffset, yOffset]) => [x + xOffset, y + yOffset]);
}

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCellKeys = new Set(cells.map(cellKey));
  const candidates = new Map(
    cells.flatMap(neighboringCells).map((cell) => [cellKey(cell), cell]),
  );

  return [...candidates.values()].filter((cell) => {
    const liveNeighborCount = cells.filter((candidate) => areNeighbors(cell, candidate)).length;
    const survives = livingCellKeys.has(cellKey(cell))
      && liveNeighborCount >= MIN_SURVIVAL_NEIGHBORS
      && liveNeighborCount <= MAX_SURVIVAL_NEIGHBORS;
    return survives || liveNeighborCount === REPRODUCTION_NEIGHBORS;
  });
}
