export type CellCoordinate = [number, number];

const neighborOffsets: readonly CellCoordinate[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const keyFor = (x: number, y: number) => `${x},${y}`;
const coordinateFor = (key: string): CellCoordinate => key.split(",").map(Number) as CellCoordinate;

export function nextGeneration(cells: readonly CellCoordinate[]): CellCoordinate[] {
  const liveCells = new Set(cells.map(([x, y]) => keyFor(x, y)));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of neighborOffsets) {
      const key = keyFor(x + offsetX, y + offsetY);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
    }
  }

  return [...neighborCounts]
    .filter(([key, count]) => count === 3 || (count === 2 && liveCells.has(key)))
    .map(([key]) => coordinateFor(key))
    .sort(([leftX, leftY], [rightX, rightY]) => leftY - rightY || leftX - rightX);
}
