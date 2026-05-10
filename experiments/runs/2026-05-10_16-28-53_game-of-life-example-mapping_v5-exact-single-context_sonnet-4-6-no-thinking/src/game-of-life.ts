type Cell = [number, number];

const neighborsOf = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                  [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

const sameCell = ([ax, ay]: Cell, [bx, by]: Cell): boolean => ax === bx && ay === by;

const isAlive = (cells: Cell[], cell: Cell): boolean =>
  cells.some(c => sameCell(c, cell));

const liveNeighborCount = (cells: Cell[], cell: Cell): number =>
  neighborsOf(cell).filter(n => isAlive(cells, n)).length;

const unique = (cells: Cell[]): Cell[] =>
  cells.filter((cell, i, all) => all.findIndex(c => sameCell(c, cell)) === i);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const candidates = unique(cells.concat(cells.flatMap(neighborsOf)));
  return candidates.filter(cell => {
    const count = liveNeighborCount(cells, cell);
    return isAlive(cells, cell) ? count === 2 || count === 3 : count === 3;
  });
};
