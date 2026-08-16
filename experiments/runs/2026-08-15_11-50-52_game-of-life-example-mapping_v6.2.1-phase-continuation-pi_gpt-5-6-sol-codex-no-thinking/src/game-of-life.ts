export type Cell = [number, number];

const BIRTH_OR_SURVIVAL_NEIGHBOR_COUNT = 3;
const SURVIVAL_NEIGHBOR_COUNT = 2;

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

export function nextGeneration(livingCells: Cell[]): Cell[] {
  const livingCellsByKey = new Map(
    livingCells.map((cell) => [cellKey(cell), cell] as const),
  );
  const neighborCounts = new Map<string, number>();
  const candidateCells = new Map<string, Cell>();

  for (const [x, y] of livingCellsByKey.values()) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + offsetX, y + offsetY];
      const key = cellKey(neighbor);
      neighborCounts.set(key, (neighborCounts.get(key) ?? 0) + 1);
      candidateCells.set(key, neighbor);
    }
  }

  return [...candidateCells]
    .filter(([key]) => {
      const neighborCount = neighborCounts.get(key);
      return neighborCount === BIRTH_OR_SURVIVAL_NEIGHBOR_COUNT
        || (neighborCount === SURVIVAL_NEIGHBOR_COUNT
          && livingCellsByKey.has(key));
    })
    .map(([, cell]) => cell)
    .sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
