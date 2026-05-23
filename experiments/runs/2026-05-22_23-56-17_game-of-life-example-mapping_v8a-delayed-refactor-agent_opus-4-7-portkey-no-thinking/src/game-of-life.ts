type Cell = [number, number];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const cellOf = (key: string): Cell => {
  const [x, y] = key.split(',');
  return [Number(x), Number(y)];
};

const survivesNextGeneration = (isAlive: boolean, liveNeighbors: number): boolean =>
  liveNeighbors === 3 || (liveNeighbors === 2 && isAlive);

const countLiveNeighborsByCell = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = keyOf([x + dx, y + dy]);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }
  return counts;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(keyOf));
  const neighborCounts = countLiveNeighborsByCell(cells);

  const survivors: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survivesNextGeneration(liveSet.has(key), count)) {
      survivors.push(cellOf(key));
    }
  }
  return survivors;
}
