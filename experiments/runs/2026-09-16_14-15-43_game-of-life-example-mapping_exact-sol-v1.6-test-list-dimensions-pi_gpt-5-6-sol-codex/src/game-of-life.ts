export type Cell = [number, number];

const MIN_SURVIVAL_NEIGHBORS = 2;
const MAX_SURVIVAL_NEIGHBORS = 3;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

type Candidate = { cell: Cell; liveNeighborCount: number };

function coordinateKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([xOffset, yOffset]) =>
    [x + xOffset, y + yOffset],
  );
}

function survives(cell: Cell, livingKeys: Set<string>): boolean {
  const liveNeighborCount = neighborsOf(cell)
    .filter((neighbor) => livingKeys.has(coordinateKey(neighbor))).length;
  return liveNeighborCount >= MIN_SURVIVAL_NEIGHBORS
    && liveNeighborCount <= MAX_SURVIVAL_NEIGHBORS;
}

function reproductions(livingCells: Cell[], livingKeys: Set<string>): Cell[] {
  const candidates = new Map<string, Candidate>();
  for (const livingCell of livingCells) {
    for (const cell of neighborsOf(livingCell)) {
      const key = coordinateKey(cell);
      const previousCount = candidates.get(key)?.liveNeighborCount ?? 0;
      candidates.set(key, { cell, liveNeighborCount: previousCount + 1 });
    }
  }
  return [...candidates.values()]
    .filter(({ cell, liveNeighborCount }) =>
      liveNeighborCount === REPRODUCTION_NEIGHBORS
      && !livingKeys.has(coordinateKey(cell)),
    )
    .map(({ cell }) => cell);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingKeys = new Set(cells.map(coordinateKey));
  return [
    ...cells.filter((cell) => survives(cell, livingKeys)),
    ...reproductions(cells, livingKeys),
  ];
}
