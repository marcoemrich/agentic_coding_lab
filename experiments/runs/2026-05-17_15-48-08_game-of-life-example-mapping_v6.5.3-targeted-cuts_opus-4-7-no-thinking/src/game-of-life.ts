export type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;
const cellOf = (key: string): Cell =>
  key.split(",").map(Number) as Cell;

const neighborOffsets: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const neighborsOf = ([x, y]: Cell): Cell[] =>
  neighborOffsets.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(keyOf));
  const neighborCounts = countNeighbors(cells);

  // Conway's rule, simplified: a cell lives next gen if it has exactly 3
  // neighbors, or if it is already alive with exactly 2 neighbors.
  const survives = (k: string, count: number): boolean =>
    count === 3 || (count === 2 && live.has(k));

  const survivors: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (survives(k, count)) survivors.push(cellOf(k));
  }
  return survivors;
}

function countNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const cell of cells) {
    for (const neighbor of neighborsOf(cell)) {
      const k = keyOf(neighbor);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  return counts;
}
