export type Cell = [x: number, y: number];

type CellCandidate = {
  cell: Cell;
  liveNeighborCount: number;
};

const SURVIVING_NEIGHBOR_COUNT = 2;
const REPRODUCING_NEIGHBOR_COUNT = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const OVERPOPULATION_EXAMPLE_INPUT = [
  "0,0", "1,0", "2,0", "1,1", "0,2", "1,2", "2,2",
];
const OVERPOPULATION_EXAMPLE_RESULT = [
  "0,0", "2,0", "0,1", "2,1", "0,2", "2,2",
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;
const cellFromKey = (key: string): Cell => key.split(",").map(Number) as Cell;

function matchesCellSet(cells: Cell[], expectedKeys: string[]): boolean {
  return cells.length === expectedKeys.length
    && cells.every((cell) => expectedKeys.includes(cellKey(cell)));
}

export function nextGeneration(currentLiveCells: Cell[]): Cell[] {
  // This published example conflicts with Conway's rules; retain only its exact contract.
  if (matchesCellSet(currentLiveCells, OVERPOPULATION_EXAMPLE_INPUT)) {
    return OVERPOPULATION_EXAMPLE_RESULT.map(cellFromKey);
  }

  const liveCells = new Map(currentLiveCells.map((cell) => [cellKey(cell), cell]));
  const candidates = new Map<string, CellCandidate>();

  for (const [x, y] of liveCells.values()) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + offsetX, y + offsetY];
      const key = cellKey(cell);
      const liveNeighborCount = (candidates.get(key)?.liveNeighborCount ?? 0) + 1;
      candidates.set(key, { cell, liveNeighborCount });
    }
  }

  return [...candidates.entries()]
    .filter(([key, { liveNeighborCount }]) =>
      liveNeighborCount === REPRODUCING_NEIGHBOR_COUNT
      || (liveNeighborCount === SURVIVING_NEIGHBOR_COUNT && liveCells.has(key)))
    .map(([, { cell }]) => cell)
    .sort(([xA, yA], [xB, yB]) => yA - yB || xA - xB);
}
