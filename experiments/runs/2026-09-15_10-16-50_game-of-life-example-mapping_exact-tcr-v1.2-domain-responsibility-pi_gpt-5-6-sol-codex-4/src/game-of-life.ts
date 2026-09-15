export type Cell = [number, number];

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const MAXIMUM_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

function coordinateKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function liveNeighborCount([x, y]: Cell, livingKeys: Set<string>): number {
  return NEIGHBOR_OFFSETS.filter(([xOffset, yOffset]) =>
    livingKeys.has(coordinateKey([x + xOffset, y + yOffset])),
  ).length;
}

function deadNeighbors(cells: Cell[]): Cell[] {
  const livingKeys = new Set(cells.map(coordinateKey));
  const candidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const [xOffset, yOffset] of NEIGHBOR_OFFSETS) {
      const candidate: Cell = [x + xOffset, y + yOffset];
      const key = coordinateKey(candidate);
      if (!livingKeys.has(key)) candidates.set(key, candidate);
    }
  }
  return [...candidates.values()];
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingKeys = new Set(cells.map(coordinateKey));
  const survivors = cells.filter((cell) => {
    const neighbors = liveNeighborCount(cell, livingKeys);
    return neighbors >= MINIMUM_SURVIVAL_NEIGHBORS
      && neighbors <= MAXIMUM_SURVIVAL_NEIGHBORS;
  });
  const births = deadNeighbors(cells).filter(
    (cell) => liveNeighborCount(cell, livingKeys) === REPRODUCTION_NEIGHBORS,
  );
  return [...survivors, ...births];
}
