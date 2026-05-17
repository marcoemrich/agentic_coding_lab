export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;
const parseCell = (key: string): Cell =>
  key.split(",").map(Number) as Cell;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const survivesNextGeneration = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && liveKeys.has(key));

  return Array.from(neighborCounts)
    .filter(([key, count]) => survivesNextGeneration(key, count))
    .map(([key]) => parseCell(key));
}
