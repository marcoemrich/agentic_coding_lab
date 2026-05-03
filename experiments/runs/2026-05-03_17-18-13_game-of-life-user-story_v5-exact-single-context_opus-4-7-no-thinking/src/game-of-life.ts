export type Cell = [number, number];

const key = (x: number, y: number): string => `${x},${y}`;
const parseKey = (k: string): Cell => {
  const [x, y] = k.split(",").map(Number);
  return [x, y];
};

const neighborsOf = (x: number, y: number): Cell[] => {
  const result: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      result.push([x + dx, y + dy]);
    }
  }
  return result;
};

const isAliveNextGeneration = (
  isCurrentlyAlive: boolean,
  livingNeighborCount: number,
): boolean => {
  if (isCurrentlyAlive) return livingNeighborCount === 2 || livingNeighborCount === 3;
  return livingNeighborCount === 3;
};

export const nextGeneration = (livingCells: Cell[]): Cell[] => {
  const livingSet = new Set(livingCells.map(([x, y]) => key(x, y)));

  const candidates = new Set<string>();
  for (const [x, y] of livingCells) {
    candidates.add(key(x, y));
    for (const [nx, ny] of neighborsOf(x, y)) candidates.add(key(nx, ny));
  }

  const countLivingNeighbors = (x: number, y: number): number =>
    neighborsOf(x, y).filter(([nx, ny]) => livingSet.has(key(nx, ny))).length;

  return [...candidates]
    .map(parseKey)
    .filter(([x, y]) =>
      isAliveNextGeneration(livingSet.has(key(x, y)), countLivingNeighbors(x, y)),
    );
};
