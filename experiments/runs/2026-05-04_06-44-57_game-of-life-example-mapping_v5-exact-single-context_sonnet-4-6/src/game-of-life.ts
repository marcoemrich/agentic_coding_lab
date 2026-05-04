export type Cell = [x: number, y: number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const neighborPositions = (x: number, y: number): Cell[] => {
  const positions: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      positions.push([x + dx, y + dy]);
    }
  }
  return positions;
};

const countLiveNeighbors = (x: number, y: number, liveSet: Set<string>): number =>
  neighborPositions(x, y).filter(([nx, ny]) => liveSet.has(cellKey(nx, ny))).length;

export const nextGeneration = (livingCells: Cell[]): Cell[] => {
  const liveSet = new Set(livingCells.map(([x, y]) => cellKey(x, y)));

  const survivors = livingCells.filter(([x, y]) => {
    const n = countLiveNeighbors(x, y, liveSet);
    return n >= 2 && n <= 3;
  });

  const deadCandidates = new Map<string, Cell>();
  for (const [x, y] of livingCells) {
    for (const [nx, ny] of neighborPositions(x, y)) {
      const key = cellKey(nx, ny);
      if (!liveSet.has(key)) deadCandidates.set(key, [nx, ny]);
    }
  }

  const newborns: Cell[] = [];
  for (const [x, y] of deadCandidates.values()) {
    if (countLiveNeighbors(x, y, liveSet) === 3) newborns.push([x, y]);
  }

  return [...survivors, ...newborns];
};
