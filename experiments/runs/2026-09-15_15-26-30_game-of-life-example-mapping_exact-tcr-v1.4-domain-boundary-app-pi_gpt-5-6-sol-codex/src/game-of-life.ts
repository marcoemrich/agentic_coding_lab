export type Cell = [number, number];

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;

const cellKey = ([x, y]: Cell): string => `${x},${y}`;
const keyCell = (key: string): Cell => key.split(",").map(Number) as Cell;

const isAliveInNextGeneration = (isCurrentlyAlive: boolean, neighborCount: number): boolean =>
  neighborCount === REPRODUCTION_NEIGHBORS ||
  (neighborCount === SURVIVAL_NEIGHBORS && isCurrentlyAlive);

function neighborKeys(key: string): string[] {
  const [x, y] = keyCell(key);
  const neighbors: string[] = [];
  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = -1; dy <= 1; dy += 1) {
      if (dx !== 0 || dy !== 0) neighbors.push(cellKey([x + dx, y + dy]));
    }
  }
  return neighbors;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, number>();

  for (const key of living) {
    for (const neighbor of neighborKeys(key)) {
      neighborCounts.set(neighbor, (neighborCounts.get(neighbor) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => isAliveInNextGeneration(living.has(key), count))
    .map(([key]) => keyCell(key));
}
