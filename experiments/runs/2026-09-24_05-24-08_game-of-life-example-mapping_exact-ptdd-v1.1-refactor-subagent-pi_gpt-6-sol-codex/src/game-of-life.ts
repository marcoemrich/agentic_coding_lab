export type Cell = [number, number];

const neighborRadius = 1;

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return Math.abs(x - otherX) <= neighborRadius && Math.abs(y - otherY) <= neighborRadius &&
    (x !== otherX || y !== otherY);
}

function countLiveNeighbors(cell: Cell, cells: Cell[]): number {
  return cells.filter(otherCell => areNeighbors(cell, otherCell)).length;
}

function survives(neighborCount: number): boolean {
  const minimumSurvivalNeighbors = 2;
  const maximumSurvivalNeighbors = 3;
  return neighborCount >= minimumSurvivalNeighbors && neighborCount <= maximumSurvivalNeighbors;
}

function isBorn(neighborCount: number): boolean {
  const birthNeighborCount = 3;
  return neighborCount === birthNeighborCount;
}

function isAliveInNextGeneration(isAlive: boolean, liveNeighborCount: number): boolean {
  return isAlive ? survives(liveNeighborCount) : isBorn(liveNeighborCount);
}

function cellKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

function candidateCells(cells: Cell[]): Map<string, Cell> {
  const offsets = [-neighborRadius, 0, neighborRadius];
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const dx of offsets) {
      for (const dy of offsets) {
        const cell: Cell = [x + dx, y + dy];
        candidates.set(cellKey(cell), cell);
      }
    }
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const candidates = candidateCells(cells);
  const living = new Set(cells.map(cellKey));
  return [...candidates].filter(([key, cell]) => {
    const neighbors = countLiveNeighbors(cell, cells);
    return isAliveInNextGeneration(living.has(key), neighbors);
  }).map(([, cell]) => cell);
}
