const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function nextGeneration(liveCells: [number, number][]): [number, number][] {
  const liveCellKeys = new Set(liveCells.map(([x, y]) => `${x},${y}`));

  const isAlive = (x: number, y: number): boolean =>
    liveCellKeys.has(`${x},${y}`);

  const countNeighbors = (x: number, y: number): number =>
    NEIGHBOR_OFFSETS.filter(([dx, dy]) => isAlive(x + dx, y + dy)).length;

  const survivors = liveCells.filter(([x, y]) => {
    const count = countNeighbors(x, y);
    return count === 2 || count === 3;
  });

  const deadCandidates = new Set<string>();
  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = `${x + dx},${y + dy}`;
      if (!liveCellKeys.has(key)) {
        deadCandidates.add(key);
      }
    }
  }

  const born: [number, number][] = [];
  for (const key of deadCandidates) {
    const [x, y] = key.split(",").map(Number) as [number, number];
    if (countNeighbors(x, y) === 3) {
      born.push([x, y]);
    }
  }

  return [...survivors, ...born];
}
