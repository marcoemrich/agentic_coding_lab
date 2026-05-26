export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (wasAlive: boolean, liveNeighbors: number): boolean => {
  const isBorn = liveNeighbors === 3;
  const staysAlive = wasAlive && liveNeighbors === 2;
  return isBorn || staysAlive;
};

const dedupeCells = (cells: Cell[]): Cell[] =>
  [...new Map(cells.map((cell) => [cellKey(cell), cell])).values()];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const isAlive = (cell: Cell): boolean => liveKeys.has(cellKey(cell));
  const liveNeighborCount = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;

  // An isolated live cell (no live neighbors) dies anyway, so we only need to
  // consider cells that are neighbors of some live cell. Every surviving or
  // newly-born cell is necessarily a neighbor of at least one live cell.
  const cellsToEvaluate = dedupeCells(liveCells.flatMap(neighborsOf));

  return cellsToEvaluate.filter((cell) =>
    survives(isAlive(cell), liveNeighborCount(cell)),
  );
}
