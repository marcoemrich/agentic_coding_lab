export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const samePosition = ([ax, ay]: Cell, [bx, by]: Cell): boolean =>
  ax === bx && ay === by;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const uniqueCells = (cells: Cell[]): Cell[] =>
  cells.filter((cell, i) => !cells.slice(0, i).some((prior) => samePosition(prior, cell)));

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const isAlive = (cell: Cell): boolean =>
    cells.some((live) => samePosition(live, cell));

  const liveNeighborCount = (cell: Cell): number =>
    neighborsOf(cell).filter(isAlive).length;

  const survives = (cell: Cell): boolean =>
    [2, 3].includes(liveNeighborCount(cell));

  const isBorn = (cell: Cell): boolean =>
    !isAlive(cell) && liveNeighborCount(cell) === 3;

  const candidates = uniqueCells(cells.flatMap(neighborsOf));

  return [...cells.filter(survives), ...candidates.filter(isBorn)];
};
