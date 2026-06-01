export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const BIRTH_NEIGHBORS = 3;

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

function isAliveNextGeneration(neighbors: number, alive: boolean): boolean {
  const survives =
    alive &&
    neighbors >= MIN_SURVIVAL_NEIGHBORS &&
    neighbors <= MAX_SURVIVAL_NEIGHBORS;
  const born = !alive && neighbors === BIRTH_NEIGHBORS;
  return survives || born;
}

function countLiveNeighbors(
  cells: Cell[],
): Map<string, { cell: Cell; count: number }> {
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = keyOf(cell);
      const entry = neighborCounts.get(key) ?? { cell, count: 0 };
      entry.count++;
      neighborCounts.set(key, entry);
    }
  }
  return neighborCounts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const neighborCounts = countLiveNeighbors(cells);

  const next: Cell[] = [];
  for (const [key, { cell, count }] of neighborCounts) {
    if (isAliveNextGeneration(count, living.has(key))) {
      next.push(cell);
    }
  }
  return next;
}
