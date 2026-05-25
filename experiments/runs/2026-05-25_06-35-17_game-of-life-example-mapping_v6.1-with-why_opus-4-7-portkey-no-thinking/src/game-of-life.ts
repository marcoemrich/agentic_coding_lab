export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = (x: number, y: number) => `${x},${y}`;
const parseCellKey = (k: string): Cell => k.split(",").map(Number) as Cell;

const survives = (isCurrentlyAlive: boolean, neighborCount: number): boolean =>
  isCurrentlyAlive ? neighborCount === 2 || neighborCount === 3 : neighborCount === 3;

const countLiveNeighborsByCell = (liveCells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const k = cellKey(x + dx, y + dy);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  return counts;
};

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countLiveNeighborsByCell(liveCells);

  const nextGenCells: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (survives(liveKeys.has(k), count)) {
      nextGenCells.push(parseCellKey(k));
    }
  }
  return nextGenCells;
}
