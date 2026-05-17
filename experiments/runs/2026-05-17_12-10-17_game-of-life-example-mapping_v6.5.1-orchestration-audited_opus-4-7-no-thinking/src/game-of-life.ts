export type Cell = [x: number, y: number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const candidates = new Map<string, Cell>();
  const counts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const k = cellKey(neighbor);
      candidates.set(k, neighbor);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }

  const survives = (k: string, count: number): boolean =>
    count === 3 || (count === 2 && liveKeys.has(k));

  const result: Cell[] = [];
  for (const [k, count] of counts) {
    if (survives(k, count)) result.push(candidates.get(k)!);
  }
  return result;
}
