type Cell = [number, number]; // [x, y]

const toKey = ([x, y]: Cell): string => `${x},${y}`;
const fromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

const survives = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (isAlive && liveNeighbors === 2);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(toKey));
  const liveNeighborCounts = new Map<string, number>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = toKey(neighbor);
      liveNeighborCounts.set(key, (liveNeighborCounts.get(key) ?? 0) + 1);
    }
  }

  const nextCells: Cell[] = [];
  for (const [key, count] of liveNeighborCounts) {
    if (survives(liveCells.has(key), count)) {
      nextCells.push(fromKey(key));
    }
  }
  return nextCells;
}
