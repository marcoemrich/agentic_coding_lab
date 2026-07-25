export type Cell = [number, number];

const SURVIVAL_NEIGHBOR_COUNT = 2;
const BIRTH_OR_SURVIVAL_NEIGHBOR_COUNT = 3;

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function neighborsOf(x: number, y: number): Cell[] {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
}

function countLiveNeighbors(
  x: number,
  y: number,
  liveSet: Set<string>
): number {
  return neighborsOf(x, y).filter(([nx, ny]) => liveSet.has(cellKey(nx, ny)))
    .length;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const candidates = new Map<string, Cell>();

  for (const [x, y] of liveCells) {
    candidates.set(cellKey(x, y), [x, y]);
    for (const [nx, ny] of neighborsOf(x, y)) {
      candidates.set(cellKey(nx, ny), [nx, ny]);
    }
  }

  const result: Cell[] = [];
  for (const [key, cell] of candidates) {
    const [x, y] = cell;
    const neighbors = countLiveNeighbors(x, y, liveSet);
    const isAlive = liveSet.has(key);
    const willBeAlive =
      neighbors === BIRTH_OR_SURVIVAL_NEIGHBOR_COUNT ||
      (isAlive && neighbors === SURVIVAL_NEIGHBOR_COUNT);

    if (willBeAlive) {
      result.push(cell);
    }
  }

  return result;
}
