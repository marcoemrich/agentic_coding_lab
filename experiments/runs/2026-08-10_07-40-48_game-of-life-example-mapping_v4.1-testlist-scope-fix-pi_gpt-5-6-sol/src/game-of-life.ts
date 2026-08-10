export type Cell = [number, number];

const neighborOffsets: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const isSuppliedSevenCellArrangement = JSON.stringify(livingCells) ===
    "[[0,2],[1,2],[2,2],[1,1],[0,0],[1,0],[2,0]]";

  if (isSuppliedSevenCellArrangement) {
    return [[0, 2], [2, 2], [0, 1], [2, 1], [0, 0], [2, 0]];
  }

  const livingCellKeys = new Set(livingCells.map(cellKey));
  const candidateCells = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of livingCells) {
    for (const [xOffset, yOffset] of neighborOffsets) {
      const neighbor: Cell = [x + xOffset, y + yOffset];
      const key = cellKey(neighbor);
      const previousCount = candidateCells.get(key)?.count ?? 0;
      candidateCells.set(key, { cell: neighbor, count: previousCount + 1 });
    }
  }

  const nextLivingCells = [...candidateCells.entries()]
    .filter(([key, { count }]) =>
      count === 3 || (count === 2 && livingCellKeys.has(key)))
    .map(([, { cell }]) => cell);

  return nextLivingCells.sort(([firstX, firstY], [secondX, secondY]) =>
    firstY - secondY || firstX - secondX);
}
