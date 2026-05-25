export type Cell = [number, number];

type CellKey = string;

const cellKey = (x: number, y: number): CellKey => `${x},${y}`;
const parseKey = (key: CellKey): Cell => {
  const [x, y] = key.split(",");
  return [Number(x), Number(y)];
};

function countNeighbors(cells: Cell[]): Map<CellKey, number> {
  const counts = new Map<CellKey, number>();
  for (const [x, y] of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
  }
  return counts;
}

function survives(isAlive: boolean, neighborCount: number): boolean {
  return neighborCount === 3 || (isAlive && neighborCount === 2);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const aliveKeys = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const neighborCounts = countNeighbors(cells);

  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survives(aliveKeys.has(key), count)) {
      result.push(parseKey(key));
    }
  }
  return result;
}
