export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveCells = new Set(cells.map(cellKey));
  const candidates = new Map<string, Cell>();
  const liveNeighborCounts = new Map<string, number>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const k = cellKey(neighbor);
      candidates.set(k, neighbor);
      liveNeighborCounts.set(k, (liveNeighborCounts.get(k) ?? 0) + 1);
    }
  }

  const result: Cell[] = [];
  for (const [k, cell] of candidates) {
    if (survives(liveCells.has(k), liveNeighborCounts.get(k)!)) {
      result.push(cell);
    }
  }
  return result;
};
