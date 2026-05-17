export type Cell = [number, number];

type CellKey = string;

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function toKey(x: number, y: number): CellKey {
  return `${x},${y}`;
}

function fromKey(key: CellKey): Cell {
  const commaIndex = key.indexOf(',');
  return [
    Number(key.slice(0, commaIndex)),
    Number(key.slice(commaIndex + 1)),
  ];
}

function survives(isAlive: boolean, liveNeighborCount: number): boolean {
  return liveNeighborCount === 3 || (isAlive && liveNeighborCount === 2);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set<CellKey>(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = countLiveNeighbors(cells);

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(liveCells.has(key), count)) {
      next.push(fromKey(key));
    }
  }
  return next;
}

function countLiveNeighbors(cells: Cell[]): Map<CellKey, number> {
  const counts = new Map<CellKey, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey(x + dx, y + dy);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}
