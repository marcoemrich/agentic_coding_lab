export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighbours = ([x, y]: Cell): Cell[] => [
  [x - 1, y - 1],
  [x, y - 1],
  [x + 1, y - 1],
  [x - 1, y],
  [x + 1, y],
  [x - 1, y + 1],
  [x, y + 1],
  [x + 1, y + 1],
];

const uniqueCells = (cells: Cell[]): Cell[] => [
  ...new Map(cells.map((cell) => [cellKey(cell), cell])).values(),
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const isLive = (cell: Cell): boolean => liveKeys.has(cellKey(cell));
  const liveNeighbourCount = (cell: Cell): number =>
    neighbours(cell).filter(isLive).length;

  // Birth: a dead cell with exactly 3 live neighbours comes alive.
  // Survival: a live cell with 2 or 3 live neighbours lives on; otherwise it
  // dies of underpopulation (<2) or overpopulation (>3).
  const isAliveNextGeneration = (cell: Cell): boolean => {
    const liveNeighbours = liveNeighbourCount(cell);
    return liveNeighbours === 3 || (liveNeighbours === 2 && isLive(cell));
  };

  // A cell can only change state if it is live or touches a live cell.
  const candidates = uniqueCells(
    liveCells.flatMap((cell) => [cell, ...neighbours(cell)]),
  );

  return candidates.filter(isAliveNextGeneration);
}
