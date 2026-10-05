export type Cell = [number, number];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function areNeighbors([x, y]: Cell, [otherX, otherY]: Cell): boolean {
  return Math.abs(x - otherX) <= 1 && Math.abs(y - otherY) <= 1 &&
    (x !== otherX || y !== otherY);
}

function countLiveNeighbors(cell: Cell, livingCells: Cell[]): number {
  return livingCells.filter(other => areNeighbors(cell, other)).length;
}

function survives(liveNeighborCount: number): boolean {
  const minimumSurvivalNeighbors = 2;
  const maximumSurvivalNeighbors = 3;
  return liveNeighborCount >= minimumSurvivalNeighbors &&
    liveNeighborCount <= maximumSurvivalNeighbors;
}

function reproduces(liveNeighborCount: number): boolean {
  const reproductionNeighbors = 3;
  return liveNeighborCount === reproductionNeighbors;
}

function isAliveNextGeneration(isCurrentlyAlive: boolean, liveNeighborCount: number): boolean {
  return isCurrentlyAlive
    ? survives(liveNeighborCount)
    : reproduces(liveNeighborCount);
}

function cellAndNeighbors([x, y]: Cell): Cell[] {
  const positions: Cell[] = [];
  for (const dx of [-1, 0, 1]) {
    for (const dy of [-1, 0, 1]) {
      positions.push([x + dx, y + dy]);
    }
  }
  return positions;
}

function nextGenerationCandidates(cells: Cell[]): Cell[] {
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    for (const candidate of cellAndNeighbors(cell)) {
      candidates.set(cellKey(candidate), candidate);
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  return nextGenerationCandidates(cells).filter(cell => {
    const liveNeighborCount = countLiveNeighbors(cell, cells);
    return isAliveNextGeneration(living.has(cellKey(cell)), liveNeighborCount);
  });
}
