export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<Cell> = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;
const keyToCell = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(cellKey));
  const neighborCounts = new Map<string, number>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const key = cellKey([x + dx, y + dy]);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }
  const result: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    const isAlive = alive.has(key);
    const survives = isAlive && (count === 2 || count === 3);
    const born = !isAlive && count === 3;
    if (survives || born) {
      result.push(keyToCell(key));
    }
  }
  return result;
}
