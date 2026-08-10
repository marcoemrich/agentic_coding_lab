export type Cell = [number, number];

const OFFSETS: Cell[] = [-1, 0, 1].flatMap((dx) =>
  [-1, 0, 1]
    .filter((dy) => dx !== 0 || dy !== 0)
    .map((dy): Cell => [dx, dy]),
);

const keyOf = ([x, y]: Cell): string => `${x},${y}`;
const SURVIVAL_NEIGHBORS = 2;
const BIRTH_NEIGHBORS = 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const uniqueCells = new Map(cells.map((cell) => [keyOf(cell), cell])).values();
  const liveKeys = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of uniqueCells) {
    for (const [dx, dy] of OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = keyOf(cell);
      const entry = neighborCounts.get(key);
      neighborCounts.set(key, { cell, count: (entry?.count ?? 0) + 1 });
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) =>
      count === BIRTH_NEIGHBORS ||
      (count === SURVIVAL_NEIGHBORS && liveKeys.has(key)))
    .map(([, { cell }]) => cell);
}
