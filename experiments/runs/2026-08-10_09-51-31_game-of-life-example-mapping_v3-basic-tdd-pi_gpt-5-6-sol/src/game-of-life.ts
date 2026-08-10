export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function key([x, y]: Cell): string {
  return `${x},${y}`;
}

function uniqueCells(cells: Cell[]): Map<string, Cell> {
  return new Map(cells.map((cell) => [key(cell), cell]));
}

function countNeighbors(livingCells: Iterable<Cell>): Map<string, [Cell, number]> {
  const counts = new Map<string, [Cell, number]>();
  for (const [x, y] of livingCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const neighborKey = key(neighbor);
      counts.set(neighborKey, [neighbor, (counts.get(neighborKey)?.[1] ?? 0) + 1]);
    }
  }
  return counts;
}

function survives(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === REPRODUCTION_NEIGHBORS
    || (isAlive && neighborCount === MIN_SURVIVAL_NEIGHBORS);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = uniqueCells(cells);
  const counts = countNeighbors(living.values());
  return [...counts.entries()]
    .filter(([cellKey, [, count]]) => survives(living.has(cellKey), count))
    .map(([, [cell]]) => cell)
    .sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);
}
