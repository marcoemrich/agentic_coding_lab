export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  const isSameCell = x === otherX && y === otherY;
  return !isSameCell && Math.abs(x - otherX) <= 1 && Math.abs(y - otherY) <= 1;
}

function candidatesAround(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
      for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
        const candidate: Cell = [x + deltaX, y + deltaY];
        candidates.set(cellKey(candidate), candidate);
      }
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCellKeys = new Set(cells.map(cellKey));
  return candidatesAround(cells).filter((candidate) => {
    const neighborCount = cells.filter((cell) => areNeighbors(candidate, cell)).length;
    const survives = livingCellKeys.has(cellKey(candidate))
      && neighborCount >= MINIMUM_SURVIVAL_NEIGHBORS
      && neighborCount <= MAXIMUM_SURVIVAL_NEIGHBORS;
    return survives || neighborCount === REPRODUCTION_NEIGHBORS;
  });
}
