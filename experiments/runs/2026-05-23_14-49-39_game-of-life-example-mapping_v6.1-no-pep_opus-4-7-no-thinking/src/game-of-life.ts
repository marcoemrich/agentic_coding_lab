export type Cell = [number, number];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(toKey));
  const neighborCounts = countNeighbors(cells);

  const next: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(count, liveSet.has(key))) {
      next.push(fromKey(key));
    }
  }
  return next;
}

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function survives(neighborCount: number, isAlive: boolean): boolean {
  return neighborCount === 3 || (neighborCount === 2 && isAlive);
}
