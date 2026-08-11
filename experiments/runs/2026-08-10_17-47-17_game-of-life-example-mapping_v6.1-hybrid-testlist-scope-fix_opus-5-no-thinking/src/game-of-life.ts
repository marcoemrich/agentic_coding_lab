export type Cell = [number, number];

// The four rules turn on three thresholds: fewer than two live neighbors is
// underpopulation, more than three is overpopulation, and exactly three brings
// a dead cell to life.
const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = 3;

const survivesWith = (liveNeighbors: number): boolean =>
  liveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
  liveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE;

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  [-1, 0, 1].flatMap((dx) =>
    [-1, 0, 1]
      .filter((dy) => !(dx === 0 && dy === 0))
      .map((dy): Cell => [x + dx, y + dy]),
  );

/**
 * Every cell that touches at least one live cell, paired with how many live
 * neighbors it has. Cells with no live neighbors are absent: they can neither
 * be born nor survive, so the infinite grid never needs to be enumerated.
 */
const countLiveNeighbors = (liveCells: Cell[]): Map<string, [Cell, number]> =>
  liveCells.flatMap(neighborsOf).reduce((counts, neighbor) => {
    const key = keyOf(neighbor);
    const [, count] = counts.get(key) ?? [neighbor, 0];
    return counts.set(key, [neighbor, count + 1]);
  }, new Map<string, [Cell, number]>());

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveNeighborCounts = countLiveNeighbors(liveCells);
  const liveKeys = new Set(liveCells.map(keyOf));
  const liveNeighborsOf = (cell: Cell): number =>
    liveNeighborCounts.get(keyOf(cell))?.[1] ?? 0;

  const survivors = liveCells.filter((cell) =>
    survivesWith(liveNeighborsOf(cell)),
  );

  const births = [...liveNeighborCounts.entries()]
    .filter(([key]) => !liveKeys.has(key))
    .filter(([, [, count]]) => count === NEIGHBORS_TO_BE_BORN)
    .map(([, [cell]]) => cell);

  return [...survivors, ...births];
}
