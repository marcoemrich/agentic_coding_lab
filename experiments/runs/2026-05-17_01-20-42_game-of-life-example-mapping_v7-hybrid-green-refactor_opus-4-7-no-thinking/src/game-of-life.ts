export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const isAliveNext = (isCurrentlyAlive: boolean, liveNeighborCount: number): boolean =>
  liveNeighborCount === 3 || (isCurrentlyAlive && liveNeighborCount === 2);

const countLiveNeighbors = (cell: Cell, liveCellKeys: Set<string>): number =>
  neighborsOf(cell).filter((neighbor) => liveCellKeys.has(cellKey(neighbor))).length;

const candidateCells = (liveCells: Cell[]): Cell[] => {
  const candidates = new Map<string, Cell>();
  for (const cell of liveCells) {
    candidates.set(cellKey(cell), cell);
    for (const neighbor of neighborsOf(cell)) {
      candidates.set(cellKey(neighbor), neighbor);
    }
  }
  return [...candidates.values()];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCellKeys = new Set(cells.map(cellKey));
  return candidateCells(cells).filter((cell) =>
    isAliveNext(liveCellKeys.has(cellKey(cell)), countLiveNeighbors(cell, liveCellKeys)),
  );
}
