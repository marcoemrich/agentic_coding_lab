export type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const livesNextGeneration = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(keyOf));
  const candidates = new Map<string, Cell>();
  const counts = new Map<string, number>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const k = keyOf(neighbor);
      candidates.set(k, neighbor);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  return Array.from(candidates).flatMap(([k, cell]) =>
    livesNextGeneration(liveKeys.has(k), counts.get(k) ?? 0) ? [cell] : []
  );
}
