export type Cell = [number, number];

const cellToKey = ([x, y]: Cell): string => `${x},${y}`;
const keyToCell = (key: string): Cell => key.split(",").map(Number) as Cell;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellToKey));
  const liveNeighborCounts = new Map<string, number>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellToKey(neighbor);
      liveNeighborCounts.set(key, (liveNeighborCounts.get(key) ?? 0) + 1);
    }
  }

  const isAliveNextGeneration = (key: string, liveNeighbors: number): boolean =>
    liveNeighbors === 3 || (liveNeighbors === 2 && liveKeys.has(key));

  return [...liveNeighborCounts]
    .filter(([key, count]) => isAliveNextGeneration(key, count))
    .map(([key]) => keyToCell(key));
}
