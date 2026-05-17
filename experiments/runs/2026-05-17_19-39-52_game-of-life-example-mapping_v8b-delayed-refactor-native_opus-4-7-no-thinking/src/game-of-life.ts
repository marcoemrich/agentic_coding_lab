type Cell = [number, number];
type CellKey = string;

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function toKey(x: number, y: number): CellKey {
  return `${x},${y}`;
}

function fromKey(key: CellKey): Cell {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
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

function survives(isAlive: boolean, liveNeighbors: number): boolean {
  return liveNeighbors === 3 || (liveNeighbors === 2 && isAlive);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = countLiveNeighbors(cells);

  const nextCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(liveCells.has(key), count)) {
      nextCells.push(fromKey(key));
    }
  }
  return nextCells;
}
