export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const countLiveNeighbors = (cell: Cell, liveKeys: Set<string>): number =>
  neighborsOf(cell).filter((neighbor) => liveKeys.has(cellKey(neighbor))).length;

const survives = (liveNeighbors: number, isAlive: boolean): boolean =>
  liveNeighbors === 3 || (liveNeighbors === 2 && isAlive);

const candidateCells = (liveCells: Cell[]): Cell[] => {
  const seen = new Set<string>();
  const candidates: Cell[] = [];
  for (const liveCell of liveCells) {
    for (const cell of [liveCell, ...neighborsOf(liveCell)]) {
      const key = cellKey(cell);
      if (!seen.has(key)) {
        seen.add(key);
        candidates.push(cell);
      }
    }
  }
  return candidates;
};

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(cellKey));
  return candidateCells(liveCells).filter((cell) =>
    survives(countLiveNeighbors(cell, liveKeys), liveKeys.has(cellKey(cell)))
  );
};
