export type Cell = [number, number];

type CellKey = string;

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function toKey([x, y]: Cell): CellKey {
  return `${x},${y}`;
}

function fromKey(key: CellKey): Cell {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
}

function countNeighbors(cells: Cell[]): Map<CellKey, number> {
  const counts = new Map<CellKey, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function survivesOrIsBorn(neighborCount: number, wasAlive: boolean): boolean {
  if (wasAlive) return neighborCount === 2 || neighborCount === 3;
  return neighborCount === 3;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(toKey));
  const neighborCounts = countNeighbors(cells);

  const nextLive: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survivesOrIsBorn(count, liveCells.has(key))) {
      nextLive.push(fromKey(key));
    }
  }
  return nextLive;
}
