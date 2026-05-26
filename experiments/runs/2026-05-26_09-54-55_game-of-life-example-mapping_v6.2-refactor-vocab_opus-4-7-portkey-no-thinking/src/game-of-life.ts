// A live cell's coordinates as [x, y]. The grid is unbounded;
// coordinates may be negative.
export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (
  cell: Cell,
  liveSet: ReadonlySet<string>,
): number =>
  neighborsOf(cell).filter((neighbor) => liveSet.has(keyOf(neighbor))).length;

const survivesToNextGeneration = (liveNeighborCount: number): boolean =>
  liveNeighborCount === 2 || liveNeighborCount === 3;

const isBornNextGeneration = (liveNeighborCount: number): boolean =>
  liveNeighborCount === 3;

const uniqueDeadNeighbors = (
  liveCells: Cell[],
  liveSet: ReadonlySet<string>,
): Cell[] => {
  const deadNeighbors = new Map<string, Cell>();
  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = keyOf(neighbor);
      if (!liveSet.has(key)) deadNeighbors.set(key, neighbor);
    }
  }
  return [...deadNeighbors.values()];
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(keyOf));
  const deadNeighbors = uniqueDeadNeighbors(liveCells, liveSet);

  const matchingNeighborRule = (candidates: Cell[], rule: (n: number) => boolean) =>
    candidates.filter((cell) => rule(countLiveNeighbors(cell, liveSet)));

  const survivors = matchingNeighborRule(liveCells, survivesToNextGeneration);
  const births = matchingNeighborRule(deadNeighbors, isBornNextGeneration);
  return [...survivors, ...births];
}
