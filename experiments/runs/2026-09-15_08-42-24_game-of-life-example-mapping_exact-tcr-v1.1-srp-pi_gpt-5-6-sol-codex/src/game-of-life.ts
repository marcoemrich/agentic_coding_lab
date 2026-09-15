export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;

type GenerationCandidate = {
  cell: Cell;
  liveNeighbors: number;
};

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighboringCells([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let xOffset = -1; xOffset <= 1; xOffset += 1) {
    for (let yOffset = -1; yOffset <= 1; yOffset += 1) {
      if (xOffset !== 0 || yOffset !== 0) {
        neighbors.push([x + xOffset, y + yOffset]);
      }
    }
  }
  return neighbors;
}

function generationCandidates(cells: Cell[]): GenerationCandidate[] {
  const candidatesByKey = new Map<string, GenerationCandidate>();
  for (const cell of cells) {
    for (const neighbor of neighboringCells(cell)) {
      const key = cellKey(neighbor);
      const previousCount = candidatesByKey.get(key)?.liveNeighbors ?? 0;
      candidatesByKey.set(key, { cell: neighbor, liveNeighbors: previousCount + 1 });
    }
  }
  return [...candidatesByKey.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCellKeys = new Set(cells.map(cellKey));
  return generationCandidates(cells)
    .filter(({ cell, liveNeighbors }) => liveNeighbors === REPRODUCTION_NEIGHBORS
      || livingCellKeys.has(cellKey(cell)) && liveNeighbors === SURVIVAL_NEIGHBORS)
    .map(({ cell }) => cell);
}
