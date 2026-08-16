export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;

type NeighborCounts = Map<string, number>;

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function cellFromKey(key: string): Cell {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
}

function neighborsOf([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
    for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
      if (deltaX !== 0 || deltaY !== 0) {
        neighbors.push([x + deltaX, y + deltaY]);
      }
    }
  }
  return neighbors;
}

function countNeighbors(cells: Cell[]): NeighborCounts {
  const counts: NeighborCounts = new Map();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function livesNext(key: string, count: number, living: Set<string>): boolean {
  return count === REPRODUCTION_NEIGHBORS
    || (count === MINIMUM_SURVIVAL_NEIGHBORS && living.has(key));
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(cellKey));
  return [...countNeighbors(cells)]
    .filter(([key, count]) => livesNext(key, count, living))
    .map(([key]) => cellFromKey(key))
    .sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
