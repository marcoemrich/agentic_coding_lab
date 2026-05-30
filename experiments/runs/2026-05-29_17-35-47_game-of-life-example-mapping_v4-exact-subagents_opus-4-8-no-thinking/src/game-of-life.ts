type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const key = ([x, y]: Cell): string => `${x},${y}`;

const countLiveNeighbors = (cell: Cell, live: Set<string>): number =>
  NEIGHBOR_OFFSETS.filter(([dx, dy]) =>
    live.has(key([cell[0] + dx, cell[1] + dy]))
  ).length;

const survives = (liveNeighbors: number): boolean =>
  liveNeighbors === 2 || liveNeighbors === 3;

const isBorn = (liveNeighbors: number): boolean => liveNeighbors === 3;

const isAliveNextGeneration = (cell: Cell, live: Set<string>): boolean => {
  const liveNeighbors = countLiveNeighbors(cell, live);
  return live.has(key(cell)) ? survives(liveNeighbors) : isBorn(liveNeighbors);
};

const candidateCells = (cells: Cell[]): Cell[] => {
  const candidates = new Map<string, Cell>();
  for (const cell of cells) {
    candidates.set(key(cell), cell);
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [cell[0] + dx, cell[1] + dy];
      candidates.set(key(neighbor), neighbor);
    }
  }
  return [...candidates.values()];
};

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(key));
  return candidateCells(cells).filter((cell) =>
    isAliveNextGeneration(cell, live)
  );
}
