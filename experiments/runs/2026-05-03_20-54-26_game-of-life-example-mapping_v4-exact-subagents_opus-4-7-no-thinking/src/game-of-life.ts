export type Cell = [number, number];

const encodeCell = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] => {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
};

const survives = (isAlive: boolean, liveNeighborCount: number): boolean =>
  (isAlive && (liveNeighborCount === 2 || liveNeighborCount === 3)) ||
  (!isAlive && liveNeighborCount === 3);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(encodeCell));
  const liveNeighborCounts = new Map<string, { cell: Cell; count: number }>();
  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = encodeCell(neighbor);
      const entry = liveNeighborCounts.get(key);
      if (entry) entry.count++;
      else liveNeighborCounts.set(key, { cell: neighbor, count: 1 });
    }
  }
  const result: Cell[] = [];
  for (const [key, { cell, count }] of liveNeighborCounts) {
    if (survives(liveKeys.has(key), count)) result.push(cell);
  }
  return result;
}
