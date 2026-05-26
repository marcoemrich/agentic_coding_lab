export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(toKey));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  // A cell lives next generation iff it has exactly 3 live neighbors,
  // or it is currently alive and has exactly 2 live neighbors. (B3/S23)
  const nextCells: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const livesNext = count === 3 || (count === 2 && liveKeys.has(key));
    if (livesNext) {
      nextCells.push(fromKey(key));
    }
  }
  return nextCells;
}
