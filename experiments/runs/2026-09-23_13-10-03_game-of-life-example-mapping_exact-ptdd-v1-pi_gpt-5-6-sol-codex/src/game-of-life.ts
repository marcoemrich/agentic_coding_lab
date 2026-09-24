export type Cell = [number, number];

type Candidate = { cell: Cell; neighborCount: number };

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighbors([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function survives(neighborCount: number): boolean {
  return neighborCount >= MINIMUM_SURVIVAL_NEIGHBORS
    && neighborCount <= MAXIMUM_SURVIVAL_NEIGHBORS;
}

function livesInNextGeneration(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === MAXIMUM_SURVIVAL_NEIGHBORS
    || (isAlive && survives(neighborCount));
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  const candidates = new Map<string, Candidate>();
  for (const cell of cells) {
    for (const neighbor of neighbors(cell)) {
      const key = cellKey(neighbor);
      const count = candidates.get(key)?.neighborCount ?? 0;
      candidates.set(key, { cell: neighbor, neighborCount: count + 1 });
    }
  }
  return [...candidates.entries()]
    .filter(([key, candidate]) => livesInNextGeneration(living.has(key), candidate.neighborCount))
    .map(([, candidate]) => candidate.cell);
}
