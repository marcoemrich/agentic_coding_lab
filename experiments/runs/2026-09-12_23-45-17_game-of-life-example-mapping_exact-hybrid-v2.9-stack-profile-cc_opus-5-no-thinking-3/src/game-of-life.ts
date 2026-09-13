export type Cell = [number, number];

const MIN_NEIGHBOURS_TO_SURVIVE = 2;
const NEIGHBOURS_TO_REPRODUCE = 3;

const toKey = ([x, y]: Cell): string => `${x},${y}`;

const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const neighboursOf = ([x, y]: Cell): Cell[] => {
  const offsets = [-1, 0, 1];
  return offsets.flatMap((dx) =>
    offsets
      .filter((dy) => dx !== 0 || dy !== 0)
      .map((dy): Cell => [x + dx, y + dy]),
  );
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(toKey));

  const neighbourCounts = new Map<string, number>();
  for (const cell of cells) {
    for (const neighbour of neighboursOf(cell)) {
      const key = toKey(neighbour);
      neighbourCounts.set(key, (neighbourCounts.get(key) ?? 0) + 1);
    }
  }

  const isAliveNextGeneration = (key: string, count: number): boolean =>
    count === NEIGHBOURS_TO_REPRODUCE ||
    (count === MIN_NEIGHBOURS_TO_SURVIVE && living.has(key));

  // Only cells with at least one live neighbour are considered: a cell with
  // none can neither survive (needs 2-3) nor be born (needs exactly 3), so
  // every cell absent from neighbourCounts is correctly dead next generation.
  return [...neighbourCounts]
    .filter(([key, count]) => isAliveNextGeneration(key, count))
    .map(([key]) => fromKey(key));
}
