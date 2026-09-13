export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;

function keyOf([x, y]: Cell): string {
  return `${String(x)},${String(y)}`;
}

function cellOf(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function neighborsOf([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let deltaX = -1; deltaX <= 1; deltaX += 1) {
    for (let deltaY = -1; deltaY <= 1; deltaY += 1) {
      if (deltaX !== 0 || deltaY !== 0) neighbors.push([x + deltaX, y + deltaY]);
    }
  }
  return neighbors;
}

function countNeighbors(living: Set<string>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const liveKey of living) {
    for (const neighbor of neighborsOf(cellOf(liveKey))) {
      const neighborKey = keyOf(neighbor);
      counts.set(neighborKey, (counts.get(neighborKey) ?? 0) + 1);
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  return [...countNeighbors(living)]
    .filter(([key, count]) =>
      count === REPRODUCTION_NEIGHBORS
      || (count === MINIMUM_SURVIVAL_NEIGHBORS && living.has(key)))
    .map(([key]) => cellOf(key));
}
