export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const survives = (neighborCount: number, wasAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && wasAlive);

function neighborCounts(cells: Cell[]): Map<string, [Cell, number]> {
  const counts = new Map<string, [Cell, number]>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = cellKey(neighbor);
      const existing = counts.get(key);
      counts.set(key, existing ? [existing[0], existing[1] + 1] : [neighbor, 1]);
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(cellKey));
  const result: Cell[] = [];
  for (const [key, [cell, count]] of neighborCounts(cells)) {
    if (survives(count, aliveKeys.has(key))) result.push(cell);
  }
  return result;
}
