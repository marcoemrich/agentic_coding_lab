export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;

function isNeighbor([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  const xDistance = Math.abs(x - otherX);
  const yDistance = Math.abs(y - otherY);
  return (xDistance !== 0 || yDistance !== 0)
    && xDistance <= 1
    && yDistance <= 1;
}

function countLiveNeighbors(cell: Cell, cells: Cell[]): number {
  return cells.filter((candidate) => isNeighbor(cell, candidate)).length;
}

function survives(neighborCount: number): boolean {
  return neighborCount >= MINIMUM_SURVIVAL_NEIGHBORS
    && neighborCount <= MAXIMUM_SURVIVAL_NEIGHBORS;
}

function willLive(isCurrentlyAlive: boolean, neighborCount: number): boolean {
  return neighborCount === REPRODUCTION_NEIGHBORS
    || (isCurrentlyAlive && survives(neighborCount));
}

function coordinateKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function generationCandidates(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
      for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
        const candidate: Cell = [x + xOffset, y + yOffset];
        candidates.set(coordinateKey(candidate), candidate);
      }
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCellKeys = new Set(cells.map(coordinateKey));
  return generationCandidates(cells).filter((cell) => willLive(
    livingCellKeys.has(coordinateKey(cell)),
    countLiveNeighbors(cell, cells),
  ));
}
