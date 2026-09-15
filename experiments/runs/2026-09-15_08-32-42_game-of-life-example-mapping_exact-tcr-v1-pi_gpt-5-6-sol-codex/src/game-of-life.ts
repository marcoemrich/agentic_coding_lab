export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

function neighborsOf([x, y]: Cell): Cell[] {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = -1; dy <= 1; dy += 1) {
      if (dx !== 0 || dy !== 0) {
        neighbors.push([x + dx, y + dy]);
      }
    }
  }
  return neighbors;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, number>();

  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = keyOf(neighbor);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, count]) => count === REPRODUCTION_NEIGHBORS ||
      (count === MIN_SURVIVAL_NEIGHBORS && liveCells.has(key)))
    .map(([key]) => key.split(",").map(Number) as Cell);
}
