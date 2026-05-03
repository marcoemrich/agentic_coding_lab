export type Cell = [number, number];

const coordKey = (x: number, y: number): string => `${x},${y}`;

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  (isAlive && neighborCount === 2) || neighborCount === 3;

type NeighborTally = Map<string, { cell: Cell; count: number }>;

const tallyNeighbors = (cells: Cell[]): NeighborTally => {
  const tally: NeighborTally = new Map();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        const k = coordKey(nx, ny);
        const entry = tally.get(k);
        if (entry) {
          entry.count++;
        } else {
          tally.set(k, { cell: [nx, ny], count: 1 });
        }
      }
    }
  }
  return tally;
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const liveSet = new Set(cells.map(([x, y]) => coordKey(x, y)));
  const neighborCounts = tallyNeighbors(cells);

  const result: Cell[] = [];
  for (const [k, { cell, count }] of neighborCounts) {
    if (survives(liveSet.has(k), count)) {
      result.push(cell);
    }
  }
  return result;
};
