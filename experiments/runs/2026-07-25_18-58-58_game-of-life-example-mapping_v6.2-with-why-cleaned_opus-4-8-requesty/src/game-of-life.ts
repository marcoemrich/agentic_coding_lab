type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

const cellOf = (key: string): Cell => key.split(",").map(Number) as Cell;

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(keyOf));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = keyOf([x + dx, y + dy]);
      neighborCounts.set(neighborKey, (neighborCounts.get(neighborKey) ?? 0) + 1);
    }
  }

  const survivesOrIsBorn = (key: string, count: number): boolean =>
    count === 3 || (count === 2 && alive.has(key));

  const survivors: Cell[] = [];
  for (const [key, count] of neighborCounts) {
    if (survivesOrIsBorn(key, count)) survivors.push(cellOf(key));
  }
  return survivors;
}
