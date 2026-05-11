const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const toKey = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: [number, number][]): [number, number][] {
  const liveCells = new Set(cells.map(([x, y]) => toKey(x, y)));

  const countLiveNeighbors = (x: number, y: number): number =>
    NEIGHBOR_OFFSETS.filter(([dx, dy]) => liveCells.has(toKey(x + dx, y + dy))).length;

  const survivors = cells.filter(([x, y]) => {
    const neighbors = countLiveNeighbors(x, y);
    return neighbors === 2 || neighbors === 3;
  });

  const deadCandidates = new Set<string>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = toKey(x + dx, y + dy);
      if (!liveCells.has(key)) {
        deadCandidates.add(key);
      }
    }
  }

  const born: [number, number][] = [];
  for (const key of deadCandidates) {
    const [x, y] = key.split(",").map(Number) as [number, number];
    if (countLiveNeighbors(x, y) === 3) {
      born.push([x, y]);
    }
  }

  return [...survivors, ...born];
}
