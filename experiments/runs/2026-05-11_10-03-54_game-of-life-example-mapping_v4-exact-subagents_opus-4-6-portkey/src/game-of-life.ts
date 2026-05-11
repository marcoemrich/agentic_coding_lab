const toKey = (x: number, y: number): string => `${x},${y}`;

const fromKey = (key: string): [number, number] => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function nextGeneration(
  liveCells: [number, number][],
): [number, number][] {
  const liveSet = new Set(liveCells.map(([x, y]) => toKey(x, y)));

  const survivors: [number, number][] = [];
  const deadNeighborCounts = new Map<string, number>();

  for (const [x, y] of liveCells) {
    let liveNeighborCount = 0;
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey(x + dx, y + dy);
      if (liveSet.has(key)) {
        liveNeighborCount++;
      } else {
        deadNeighborCounts.set(key, (deadNeighborCounts.get(key) ?? 0) + 1);
      }
    }
    if (liveNeighborCount === 2 || liveNeighborCount === 3) {
      survivors.push([x, y]);
    }
  }

  const births: [number, number][] = [];
  for (const [key, count] of deadNeighborCounts) {
    if (count === 3) {
      births.push(fromKey(key));
    }
  }

  return [...survivors, ...births];
}
