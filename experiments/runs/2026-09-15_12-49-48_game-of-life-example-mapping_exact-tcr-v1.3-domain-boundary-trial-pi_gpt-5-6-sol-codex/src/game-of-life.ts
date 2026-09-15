export type Cell = [number, number];

type Candidate = { cell: Cell; neighborCount: number };

const SURVIVAL_NEIGHBOR_COUNT = 2;
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function countLivingNeighbors(livingCells: Map<string, Cell>): Map<string, Candidate> {
  const candidates = new Map(
    [...livingCells].map(([key, cell]) => [key, { cell, neighborCount: 0 }]),
  );
  for (const [x, y] of livingCells.values()) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = keyOf(cell);
      const neighborCount = (candidates.get(key)?.neighborCount ?? 0) + 1;
      candidates.set(key, { cell, neighborCount });
    }
  }
  return candidates;
}

function survives(neighborCount: number): boolean {
  return neighborCount === SURVIVAL_NEIGHBOR_COUNT
    || neighborCount === REPRODUCTION_NEIGHBOR_COUNT;
}

function isBorn(neighborCount: number): boolean {
  return neighborCount === REPRODUCTION_NEIGHBOR_COUNT;
}

function willLive(neighborCount: number, isAlive: boolean): boolean {
  return isAlive ? survives(neighborCount) : isBorn(neighborCount);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Map(cells.map((cell) => [keyOf(cell), cell]));
  const candidates = countLivingNeighbors(livingCells);
  return [...candidates].filter(([key, candidate]) =>
    willLive(candidate.neighborCount, livingCells.has(key)),
  ).map(([, candidate]) => candidate.cell);
}
