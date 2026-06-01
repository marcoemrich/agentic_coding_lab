type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];
const BIRTH_NEIGHBORS = 3;
const SURVIVAL_NEIGHBORS = 2;

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(cellKey: string): Cell {
  const [x, y] = cellKey.split(",").map(Number);
  return [x, y];
}

function countLiveNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor = key(x + dx, y + dy);
      counts.set(neighbor, (counts.get(neighbor) ?? 0) + 1);
    }
  }
  return counts;
}

function isAliveNextGeneration(
  liveNeighbors: number,
  isCurrentlyAlive: boolean,
): boolean {
  const isBorn = liveNeighbors === BIRTH_NEIGHBORS;
  const survives = liveNeighbors === SURVIVAL_NEIGHBORS && isCurrentlyAlive;
  return isBorn || survives;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => key(x, y)));
  const neighborCounts = countLiveNeighbors(cells);

  const next: Cell[] = [];
  for (const [cellKey, count] of neighborCounts) {
    if (isAliveNextGeneration(count, living.has(cellKey))) {
      next.push(parseKey(cellKey));
    }
  }
  return next;
}
