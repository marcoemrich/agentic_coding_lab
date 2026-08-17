type Cell = [number, number];

const NEIGHBOR_OFFSETS: readonly Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const BIRTH_NEIGHBORS = 3;

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function countLiveNeighbors(
  x: number,
  y: number,
  living: Set<string>,
): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (living.has(key(x + dx, y + dy))) {
      count++;
    }
  }
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => key(x, y)));
  const candidates = new Set<string>();

  for (const [x, y] of cells) {
    candidates.add(key(x, y));
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      candidates.add(key(x + dx, y + dy));
    }
  }

  const survivors: Cell[] = [];
  for (const id of candidates) {
    const [x, y] = id.split(",").map(Number) as Cell;
    const liveNeighbors = countLiveNeighbors(x, y, living);
    if (willBeAlive(living.has(id), liveNeighbors)) {
      survivors.push([x, y]);
    }
  }

  return survivors;
}

function willBeAlive(isAlive: boolean, liveNeighbors: number): boolean {
  if (isAlive) {
    return liveNeighbors >= MIN_SURVIVAL_NEIGHBORS && liveNeighbors <= MAX_SURVIVAL_NEIGHBORS;
  }
  return liveNeighbors === BIRTH_NEIGHBORS;
}
