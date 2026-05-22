export type Cell = [number, number];

type CellKey = string;

const toKey = ([x, y]: Cell): CellKey => `${x},${y}`;

const fromKey = (key: CellKey): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

const neighborsOf = ([x, y]: Cell): Cell[] => {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
};

const countNeighbors = (liveCells: Cell[]): Map<CellKey, number> => {
  const counts = new Map<CellKey, number>();
  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = toKey(neighbor);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
};

const survivesOrBorn = (neighborCount: number, isAlive: boolean): boolean =>
  neighborCount === 3 || (neighborCount === 2 && isAlive);

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(toKey));
  const neighborCounts = countNeighbors(liveCells);

  const survivors: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survivesOrBorn(count, liveKeys.has(key))) {
      survivors.push(fromKey(key));
    }
  }
  return survivors;
}
