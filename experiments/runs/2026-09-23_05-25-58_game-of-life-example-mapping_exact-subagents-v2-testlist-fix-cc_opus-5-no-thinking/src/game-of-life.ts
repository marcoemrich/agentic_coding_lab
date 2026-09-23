export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

const unique = (cells: Cell[]): Cell[] => {
  const seen = new Set<string>();
  return cells.filter((cell) => {
    const key = keyOf(cell);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(keyOf));
  const isAlive = (cell: Cell) => liveKeys.has(keyOf(cell));

  const countLiveNeighbors = (cell: Cell) =>
    neighborsOf(cell).filter(isAlive).length;

  const cellsToEvaluate = unique(
    cells.flatMap((cell) => [cell, ...neighborsOf(cell)]),
  );

  return cellsToEvaluate.filter((cell) => {
    const liveNeighbors = countLiveNeighbors(cell);
    return liveNeighbors === 3 || (liveNeighbors === 2 && isAlive(cell));
  });
}
