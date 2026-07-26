type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function countNeighbors(x: number, y: number, living: Set<string>): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (living.has(cellKey(x + dx, y + dy))) {
      count++;
    }
  }
  return count;
}

function addCandidateCells(
  x: number,
  y: number,
  candidates: Set<string>,
): void {
  candidates.add(cellKey(x, y));
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    candidates.add(cellKey(x + dx, y + dy));
  }
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const candidates = new Set<string>();

  for (const key of living) {
    const [x, y] = parseKey(key);
    addCandidateCells(x, y, candidates);
  }

  const next: Cell[] = [];
  for (const key of candidates) {
    const [x, y] = parseKey(key);
    const neighbors = countNeighbors(x, y, living);
    const alive = living.has(key);

    if ((alive && (neighbors === 2 || neighbors === 3)) || (!alive && neighbors === 3)) {
      next.push([x, y]);
    }
  }

  return next;
}
