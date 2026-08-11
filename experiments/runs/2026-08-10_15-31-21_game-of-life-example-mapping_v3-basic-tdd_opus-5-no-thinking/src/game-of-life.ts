export type Cell = [number, number]; // [x, y]

const MIN_NEIGHBORS_TO_SURVIVE = 2;
const MAX_NEIGHBORS_TO_SURVIVE = 3;
const NEIGHBORS_TO_BE_BORN = 3;

const key = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] => {
  const neighbors: Cell[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
};

export function nextGeneration(cells: Cell[]): Cell[] {
  // Deduplicate the input so a coordinate listed twice is still a single cell.
  const livingCells = new Map(cells.map((cell) => [key(cell), cell]));
  const living = new Set(livingCells.keys());
  const liveNeighborCount = (cell: Cell): number =>
    neighborsOf(cell).filter((neighbor) => living.has(key(neighbor))).length;

  const survivors = [...livingCells.values()].filter((cell) => {
    const count = liveNeighborCount(cell);
    return count >= MIN_NEIGHBORS_TO_SURVIVE && count <= MAX_NEIGHBORS_TO_SURVIVE;
  });

  // Only dead cells adjacent to a living cell can reach 3 live neighbors,
  // so candidates for birth are bounded by the neighborhood of living cells.
  const births = new Map<string, Cell>();
  for (const cell of livingCells.values()) {
    for (const candidate of neighborsOf(cell)) {
      const candidateKey = key(candidate);
      if (living.has(candidateKey) || births.has(candidateKey)) continue;
      if (liveNeighborCount(candidate) === NEIGHBORS_TO_BE_BORN) {
        births.set(candidateKey, candidate);
      }
    }
  }

  return [...survivors, ...births.values()];
}
