export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set<string>(cells.map(([x, y]) => toKey(x, y)));
  const neighborCounts = countNeighbors(cells);

  const survivors: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (survivesOrBorn(count, liveSet.has(k))) {
      survivors.push(parseKey(k));
    }
  }
  return survivors;
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const k = toKey(x + dx, y + dy);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  return counts;
}

function survivesOrBorn(neighborCount: number, isAlive: boolean): boolean {
  return neighborCount === 3 || (neighborCount === 2 && isAlive);
}

function toKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseKey(k: string): Cell {
  const [xStr, yStr] = k.split(",");
  return [Number(xStr), Number(yStr)];
}
