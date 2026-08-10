export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const OFFSETS = [-1, 0, 1] as const;

function key([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighbors([x, y]: Cell): Cell[] {
  return OFFSETS.flatMap((dx) => OFFSETS
    .filter((dy) => dx !== 0 || dy !== 0)
    .map((dy): Cell => [x + dx, y + dy]));
}

function countNeighbors(cells: Cell[]): { counts: Map<string, number>; coordinates: Map<string, Cell> } {
  const counts = new Map<string, number>();
  const coordinates = new Map<string, Cell>();
  for (const cell of cells) {
    for (const neighbor of neighbors(cell)) {
      const neighborKey = key(neighbor);
      coordinates.set(neighborKey, neighbor);
      counts.set(neighborKey, (counts.get(neighborKey) ?? 0) + 1);
    }
  }
  return { counts, coordinates };
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const uniqueCells = [...new Map(cells.map((cell) => [key(cell), cell])).values()];
  const living = new Set(uniqueCells.map(key));
  const { counts, coordinates } = countNeighbors(uniqueCells);
  return [...counts].filter(([cellKey, neighbors]) =>
    neighbors === REPRODUCTION_NEIGHBORS ||
    (living.has(cellKey) && neighbors >= MINIMUM_SURVIVAL_NEIGHBORS && neighbors <= MAXIMUM_SURVIVAL_NEIGHBORS)
  ).map(([cellKey]) => coordinates.get(cellKey)!);
}
