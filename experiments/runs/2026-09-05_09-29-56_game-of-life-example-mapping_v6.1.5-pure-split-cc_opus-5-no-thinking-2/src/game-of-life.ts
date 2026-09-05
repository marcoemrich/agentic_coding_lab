export type Cell = [number, number];

const NEIGHBOR_OFFSETS = [-1, 0, 1];
const NEIGHBORS_TO_SURVIVE = 2;
const NEIGHBORS_TO_BECOME_ALIVE = 3;

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));

  return cellsToEvaluate(cells).filter((cell) => {
    const liveNeighborCount = countLiveNeighbors(cell, livingCells);
    if (liveNeighborCount === NEIGHBORS_TO_BECOME_ALIVE) return true;
    return (
      liveNeighborCount === NEIGHBORS_TO_SURVIVE && livingCells.has(cellKey(cell))
    );
  });
}

function cellsToEvaluate(liveCells: Cell[]): Cell[] {
  const seen = new Map<string, Cell>();
  for (const liveCell of liveCells) {
    for (const candidate of cellAndNeighbors(liveCell)) {
      seen.set(cellKey(candidate), candidate);
    }
  }
  return [...seen.values()];
}

function cellAndNeighbors([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.flatMap((dx) =>
    NEIGHBOR_OFFSETS.map((dy): Cell => [x + dx, y + dy]),
  );
}

function neighborsOf(cell: Cell): Cell[] {
  return cellAndNeighbors(cell).filter(
    (candidate) => cellKey(candidate) !== cellKey(cell),
  );
}

function countLiveNeighbors(cell: Cell, livingCells: Set<string>): number {
  return neighborsOf(cell).filter((neighbor) =>
    livingCells.has(cellKey(neighbor)),
  ).length;
}

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}
