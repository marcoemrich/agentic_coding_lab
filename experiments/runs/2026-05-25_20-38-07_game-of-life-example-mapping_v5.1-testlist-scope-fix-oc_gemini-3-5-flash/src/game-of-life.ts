export type Cell = [number, number];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set<string>();
  for (const [x, y] of cells) {
    liveSet.add(`${x},${y}`);
  }

  const neighborCounts = new Map<string, number>();

  const getNeighbors = (x: number, y: number): [number, number][] => {
    return [
      [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
      [x - 1, y],                 [x + 1, y],
      [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
    ];
  };

  for (const [cx, cy] of cells) {
    for (const [nx, ny] of getNeighbors(cx, cy)) {
      const key = `${nx},${ny}`;
      neighborCounts.set(key, (neighborCounts.get(key) || 0) + 1);
    }
  }

  const nextLiveCells: Cell[] = [];

  for (const [key, count] of neighborCounts.entries()) {
    const isLive = liveSet.has(key);
    if (isLive) {
      if (count === 2 || count === 3) {
        const [x, y] = key.split(",").map(Number);
        nextLiveCells.push([x, y]);
      }
    } else {
      if (count === 3) {
        const [x, y] = key.split(",").map(Number);
        nextLiveCells.push([x, y]);
      }
    }
  }

  return nextLiveCells;
}
