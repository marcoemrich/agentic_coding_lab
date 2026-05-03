export const nextGeneration = (cells: Set<string>): Set<string> => {
  const neighborCounts = countLiveNeighbors(cells);
  const nextCells = new Set<string>();
  for (const [cell, count] of neighborCounts) {
    if (cellLivesNextGeneration(count, cells.has(cell))) {
      nextCells.add(cell);
    }
  }
  return nextCells;
};

const parseCell = (cell: string): [number, number] => {
  const [xStr, yStr] = cell.split(",");
  return [Number(xStr), Number(yStr)];
};

const formatCell = (x: number, y: number): string => `${x},${y}`;

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const neighborsOf = (cell: string): string[] => {
  const [x, y] = parseCell(cell);
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => formatCell(x + dx, y + dy));
};

const countLiveNeighbors = (cells: Set<string>): Map<string, number> => {
  const neighborCounts = new Map<string, number>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }
  return neighborCounts;
};

const cellLivesNextGeneration = (liveNeighborCount: number, isAlive: boolean): boolean =>
  liveNeighborCount === 3 || (liveNeighborCount === 2 && isAlive);
