type Cell = [number, number];

const OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const SURVIVAL_MIN = 2;
const SURVIVAL_MAX = 3;
const BIRTH_COUNT = 3;

const key = ([x, y]: Cell): string => `${x},${y}`;

function countNeighbors(cells: Cell[]): Map<string, { cell: Cell; count: number }> {
  const counts = new Map<string, { cell: Cell; count: number }>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const entry = counts.get(key(neighbor)) ?? { cell: neighbor, count: 0 };
      entry.count++;
      counts.set(key(neighbor), entry);
    }
  }
  return counts;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const alive = new Set(cells.map(key));
  const counts = countNeighbors(cells);
  const survivors = cells.filter((cell) => {
    const count = counts.get(key(cell))?.count ?? 0;
    return count >= SURVIVAL_MIN && count <= SURVIVAL_MAX;
  });
  const births = [...counts.values()]
    .filter(({ cell, count }) => count === BIRTH_COUNT && !alive.has(key(cell)))
    .map(({ cell }) => cell);
  return [...survivors, ...births];
}
