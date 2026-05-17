export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = uniqueCells(cells);
  const neighborCounts = countNeighbors(livingCells);

  const survivors: Cell[] = [];
  for (const [cellKey, count] of neighborCounts) {
    if (survives(count, livingCells.has(cellKey))) {
      survivors.push(parseKey(cellKey));
    }
  }
  return survivors;
}

function uniqueCells(cells: Cell[]): Set<string> {
  const set = new Set<string>();
  for (const [x, y] of cells) {
    set.add(toKey(x, y));
  }
  return set;
}

function countNeighbors(livingCells: Set<string>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const cellKey of livingCells) {
    const [x, y] = parseKey(cellKey);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = toKey(x + dx, y + dy);
      counts.set(neighborKey, (counts.get(neighborKey) ?? 0) + 1);
    }
  }
  return counts;
}

function survives(neighborCount: number, isAlive: boolean): boolean {
  return neighborCount === 3 || (isAlive && neighborCount === 2);
}

function toKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(cellKey: string): Cell {
  const [xs, ys] = cellKey.split(",");
  return [Number(xs), Number(ys)];
}
