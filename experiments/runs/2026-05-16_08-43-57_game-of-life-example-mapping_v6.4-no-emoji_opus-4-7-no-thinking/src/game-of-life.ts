export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const containsCell = (list: ReadonlyArray<Cell>, [x, y]: Cell): boolean =>
    list.some(([cx, cy]) => cx === x && cy === y);

  const neighborsOf = ([x, y]: Cell): Cell[] =>
    NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

  const countLiveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter((neighbor) => containsCell(cells, neighbor)).length;

  const survives = (cell: Cell): boolean => {
    const liveNeighbors = countLiveNeighbors(cell);
    return liveNeighbors === 2 || liveNeighbors === 3;
  };

  const isDead = (cell: Cell): boolean => !containsCell(cells, cell);

  const isFirstOccurrence = (cell: Cell, index: number, list: Cell[]): boolean =>
    !containsCell(list.slice(0, index), cell);

  const survivors = cells.filter(survives);
  const births = cells
    .flatMap(neighborsOf)
    .filter(isDead)
    .filter(isFirstOccurrence)
    .filter((cell) => countLiveNeighbors(cell) === 3);

  return [...survivors, ...births];
};
