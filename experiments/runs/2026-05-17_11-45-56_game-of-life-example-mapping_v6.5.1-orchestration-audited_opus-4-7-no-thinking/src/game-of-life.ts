export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;
const parseCell = (key: string): Cell =>
  key.split(",").map(Number) as Cell;

const survives = (neighborCount: number, wasAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && wasAlive);

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const liveSet = new Set(livingCells.map(cellKey));
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of livingCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }
  const nextCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(count, liveSet.has(key))) nextCells.push(parseCell(key));
  }
  return nextCells;
}
