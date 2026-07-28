export type Cell = [number, number]; // [x, y]

/** The eight positions surrounding a cell. */
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

const sameCell = ([x1, y1]: Cell, [x2, y2]: Cell): boolean =>
  x1 === x2 && y1 === y2;

const isAliveAt = (liveCells: Cell[], cell: Cell): boolean =>
  liveCells.some((liveCell) => sameCell(liveCell, cell));

/** The eight cells adjacent to a cell. */
const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (liveCells: Cell[], cell: Cell): number =>
  neighborsOf(cell).filter((neighbor) => isAliveAt(liveCells, neighbor)).length;

/** Cells with duplicates removed, keeping first occurrences. */
const uniqueCells = (cells: Cell[]): Cell[] =>
  cells.filter(
    (cell, index, all) =>
      all.findIndex((other) => sameCell(other, cell)) === index,
  );

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const survivors = liveCells.filter((cell) => {
    const liveNeighborCount = countLiveNeighbors(liveCells, cell);
    return liveNeighborCount === 2 || liveNeighborCount === 3;
  });

  const candidates = uniqueCells(
    liveCells
      .flatMap(neighborsOf)
      .filter((cell) => !isAliveAt(liveCells, cell)),
  );
  const births = candidates.filter(
    (cell) => countLiveNeighbors(liveCells, cell) === 3,
  );

  return [...survivors, ...births];
}
