export type Cell = [number, number];

const NEIGHBOR_OFFSETS: readonly Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const NEIGHBORS_TO_SURVIVE = 2;
const NEIGHBORS_TO_REPRODUCE = 3;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy] as Cell);

const uniqueCells = (cells: Cell[]): Cell[] =>
  [...new Map(cells.map((cell) => [cellKey(cell), cell])).values()];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(cellKey));
  const isLive = (cell: Cell): boolean => liveSet.has(cellKey(cell));

  const countLiveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter(isLive).length;

  const candidates = uniqueCells([
    ...liveCells,
    ...liveCells.flatMap(neighborsOf),
  ]);

  const isAliveNextGeneration = (cell: Cell): boolean => {
    const liveNeighbors = countLiveNeighbors(cell);
    const reproduces = liveNeighbors === NEIGHBORS_TO_REPRODUCE;
    const survives = liveNeighbors === NEIGHBORS_TO_SURVIVE && isLive(cell);
    return reproduces || survives;
  };

  return candidates.filter(isAliveNextGeneration);
}
