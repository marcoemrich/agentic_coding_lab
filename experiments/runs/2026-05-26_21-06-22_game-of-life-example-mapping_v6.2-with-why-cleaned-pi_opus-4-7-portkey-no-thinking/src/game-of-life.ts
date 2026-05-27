export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = (x: number, y: number): string => `${x},${y}`;
const parseKey = (k: string): Cell => {
  const [x, y] = k.split(",");
  return [Number(x), Number(y)];
};

// A cell is alive next generation iff it has exactly 3 live neighbors (birth/survival)
// or it is currently alive and has exactly 2 live neighbors (survival).
const isAliveNextGeneration = (wasAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (liveNeighbors === 2 && wasAlive);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const k = keyOf(x + dx, y + dy);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const nextCells: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (isAliveNextGeneration(liveKeys.has(k), count)) nextCells.push(parseKey(k));
  }
  return nextCells;
}
