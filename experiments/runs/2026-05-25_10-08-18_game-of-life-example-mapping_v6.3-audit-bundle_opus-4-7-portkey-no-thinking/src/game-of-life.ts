export type Cell = readonly [x: number, y: number];

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function countLiveNeighbors(cells: Cell[]): Map<string, [Cell, number]> {
  const counts = new Map<string, [Cell, number]>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = toKey(cell);
      const prior = counts.get(key)?.[1] ?? 0;
      counts.set(key, [cell, prior + 1]);
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(toKey));
  const survivesNextGen = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveKeys.has(key));
  return [...countLiveNeighbors(cells)]
    .filter(([key, [, count]]) => survivesNextGen(key, count))
    .map(([, [cell]]) => cell);
}
