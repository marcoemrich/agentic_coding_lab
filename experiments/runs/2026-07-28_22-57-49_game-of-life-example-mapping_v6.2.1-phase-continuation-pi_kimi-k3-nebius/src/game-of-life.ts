export type Cell = [number, number]; // [x, y]

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveCellKeys = new Set(liveCells.map(cellKey));

  // Tally live neighbors of every cell adjacent to a live cell.
  // Cells absent from the map have zero live neighbors and can
  // neither survive nor be born.
  const neighborCounts = new Map<string, number>();
  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  const liveNeighborCount = (cell: Cell): number =>
    neighborCounts.get(cellKey(cell)) ?? 0;

  const survives = (liveNeighbors: number): boolean =>
    liveNeighbors === 2 || liveNeighbors === 3;

  const isBorn = (liveNeighbors: number): boolean => liveNeighbors === 3;

  const survivors = liveCells.filter((cell) =>
    survives(liveNeighborCount(cell)),
  );

  const births: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (!liveCellKeys.has(key) && isBorn(count)) {
      const [x, y] = key.split(",").map(Number);
      births.push([x, y]);
    }
  }

  return [...survivors, ...births];
}
