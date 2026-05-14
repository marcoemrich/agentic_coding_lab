export type Cell = { x: number; y: number };

const isNeighbor = (a: Cell, b: Cell): boolean =>
  Math.abs(a.x - b.x) <= 1 &&
  Math.abs(a.y - b.y) <= 1 &&
  (a.x !== b.x || a.y !== b.y);

const countNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  liveCells.filter((candidate) => isNeighbor(cell, candidate)).length;

const cellEquals = (a: Cell, b: Cell): boolean => a.x === b.x && a.y === b.y;

const includesCell = (cells: Cell[], target: Cell): boolean =>
  cells.some((c) => cellEquals(c, target));

const neighborOffsets: { dx: number; dy: number }[] = [
  { dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: 1, dy: -1 },
  { dx: -1, dy:  0 },                     { dx: 1, dy:  0 },
  { dx: -1, dy:  1 }, { dx: 0, dy:  1 }, { dx: 1, dy:  1 },
];

const getCandidateDeadCells = (liveCells: Cell[]): Cell[] =>
  liveCells
    .flatMap((cell) =>
      neighborOffsets.map(({ dx, dy }) => ({ x: cell.x + dx, y: cell.y + dy }))
    )
    .filter(
      (candidate, index, all) =>
        !includesCell(liveCells, candidate) &&
        all.findIndex((c) => cellEquals(c, candidate)) === index
    );

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const survivors = liveCells.filter(
    (cell) => [2, 3].includes(countNeighbors(cell, liveCells))
  );

  const newborns = getCandidateDeadCells(liveCells).filter(
    (cell) => countNeighbors(cell, liveCells) === 3
  );

  return [...survivors, ...newborns];
};
