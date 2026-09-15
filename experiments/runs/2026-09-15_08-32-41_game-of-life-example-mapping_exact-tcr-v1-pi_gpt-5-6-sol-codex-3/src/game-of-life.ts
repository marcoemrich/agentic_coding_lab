export type Cell = [number, number];

const MINIMUM_SURVIVING_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const OFFSETS = [-1, 0, 1];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;
const cellOf = (key: string): Cell => key.split(",").map(Number) as Cell;

const neighborsOf = ([x, y]: Cell): Cell[] => OFFSETS
  .flatMap((dx) => OFFSETS.map((dy): Cell => [x + dx, y + dy]))
  .filter(([neighborX, neighborY]) => neighborX !== x || neighborY !== y);

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, number>();

  for (const cell of living) {
    for (const neighbor of neighborsOf(cellOf(cell))) {
      const key = keyOf(neighbor);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => count === REPRODUCTION_NEIGHBORS
      || (living.has(key) && count === MINIMUM_SURVIVING_NEIGHBORS))
    .map(([key]) => cellOf(key));
}
