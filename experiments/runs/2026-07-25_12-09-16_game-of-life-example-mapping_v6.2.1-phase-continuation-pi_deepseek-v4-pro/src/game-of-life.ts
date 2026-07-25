const key = (x: number, y: number): string => `${x},${y}`;

const parseKey = (k: string): [number, number] => {
  const [x, y] = k.split(',').map(Number);
  return [x, y];
};

// The 8 neighbor offsets for the Moore neighborhood
const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export const nextGeneration = (cells: [number, number][]): [number, number][] => {
  const liveCells = new Set(cells.map(([x, y]) => key(x, y)));

  // Count live neighbors for every candidate cell: all live cells + all dead neighbors
  const neighborCounts = new Map<string, number>();
  for (const [cx, cy] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = key(cx + dx, cy + dy);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }

  const nextGen: string[] = [];
  for (const [cellKey, neighborCount] of neighborCounts) {
    const alive = liveCells.has(cellKey);
    if ((alive && (neighborCount === 2 || neighborCount === 3)) || (!alive && neighborCount === 3)) {
      nextGen.push(cellKey);
    }
  }

  return nextGen.map(parseKey);
};