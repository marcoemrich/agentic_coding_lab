export type Cell = [number, number];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const parseCellKey = (key: string): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

const survives = (isAlive: boolean, liveNeighborCount: number): boolean =>
  (isAlive && (liveNeighborCount === 2 || liveNeighborCount === 3)) ||
  (!isAlive && liveNeighborCount === 3);

function countLiveNeighbors(cells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey([x + dx, y + dy]);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(cellKey));
  const neighborCounts = countLiveNeighbors(cells);

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(liveSet.has(key), count)) {
      result.push(parseCellKey(key));
    }
  }
  return result;
}
