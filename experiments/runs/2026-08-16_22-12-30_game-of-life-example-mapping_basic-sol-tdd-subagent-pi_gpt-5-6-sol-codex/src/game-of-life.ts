export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function liveNeighborCount([x, y]: Cell, liveCells: Cell[]): number {
  return liveCells.filter(([otherX, otherY]) =>
    (otherX !== x || otherY !== y)
    && Math.abs(otherX - x) <= 1
    && Math.abs(otherY - y) <= 1
  ).length;
}

function neighboringCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
    for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
      if (offsetX !== 0 || offsetY !== 0) neighbors.push([x + offsetX, y + offsetY]);
    }
  }
  return neighbors;
}

function deadNeighborCandidates(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(cellKey));
  const candidates = new Map<string, Cell>();
  for (const liveCell of liveCells) {
    for (const candidate of neighboringCells(liveCell)) {
      const candidateKey = cellKey(candidate);
      if (!liveCellKeys.has(candidateKey)) candidates.set(candidateKey, candidate);
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const survivors = liveCells.filter((cell) => {
    const liveNeighbors = liveNeighborCount(cell, liveCells);
    return liveNeighbors >= MIN_SURVIVAL_NEIGHBORS && liveNeighbors <= MAX_SURVIVAL_NEIGHBORS;
  });
  const births = deadNeighborCandidates(liveCells)
    .filter((cell) => liveNeighborCount(cell, liveCells) === REPRODUCTION_NEIGHBORS);
  return [...survivors, ...births];
}
