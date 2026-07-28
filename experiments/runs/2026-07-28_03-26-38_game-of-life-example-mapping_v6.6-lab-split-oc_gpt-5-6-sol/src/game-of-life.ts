export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];
const REPRODUCTION_NEIGHBOR_COUNT = 3;
const SURVIVAL_NEIGHBOR_COUNT = 2;

export function nextGeneration(currentLivingCells: Cell[]): Cell[] {
  const livingCellKeys = new Set(currentLivingCells.map(([x, y]) => `${x},${y}`));
  const neighborCounts = new Map<string, { cell: Cell; count: number }>();

  for (const [x, y] of currentLivingCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = `${cell[0]},${cell[1]}`;
      const neighborTally = neighborCounts.get(key) ?? { cell, count: 0 };
      neighborTally.count += 1;
      neighborCounts.set(key, neighborTally);
    }
  }

  return [...neighborCounts.entries()]
    .filter(([key, { count }]) =>
      count === REPRODUCTION_NEIGHBOR_COUNT
      || (count === SURVIVAL_NEIGHBOR_COUNT && livingCellKeys.has(key)))
    .map(([, { cell }]) => cell);
}
