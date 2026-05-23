export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isAlive);

type Candidate = { cell: Cell; neighborCount: number };

function countNeighborOccurrences(liveCells: Cell[]): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const liveCell of liveCells) {
    for (const neighbor of neighborsOf(liveCell)) {
      const key = cellKey(neighbor);
      const existing = candidates.get(key);
      if (existing) existing.neighborCount++;
      else candidates.set(key, { cell: neighbor, neighborCount: 1 });
    }
  }
  return candidates;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(cellKey));
  const candidates = countNeighborOccurrences(liveCells);

  const nextLiveCells: Cell[] = [];
  for (const [key, { cell, neighborCount }] of candidates) {
    if (survives(liveCellKeys.has(key), neighborCount)) nextLiveCells.push(cell);
  }
  return nextLiveCells;
}
