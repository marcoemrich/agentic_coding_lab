export type Cell = [number, number]; // [x, y]

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const isCurrentlyAlive = new Set(liveCells.map(keyOf));

  // Only cells adjacent to a live cell can change state, so the neighbor
  // tally doubles as the set of candidates worth considering.
  const candidates = tallyLiveNeighborsByCell(liveCells);

  return [...candidates]
    .filter(([candidate, liveNeighbors]) =>
      isAliveNextGeneration(liveNeighbors, isCurrentlyAlive.has(candidate)),
    )
    .map(([candidate]) => cellFrom(candidate));
}

function isAliveNextGeneration(
  liveNeighbors: number,
  wasAlive: boolean,
): boolean {
  const survives = liveNeighbors === 2 || liveNeighbors === 3;
  const isBorn = liveNeighbors === 3;

  return wasAlive ? survives : isBorn;
}

function tallyLiveNeighborsByCell(liveCells: Cell[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const liveCell of liveCells) {
    for (const neighbor of neighborsOf(liveCell)) {
      const key = keyOf(neighbor);

      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return counts;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function keyOf([x, y]: Cell): string {
  return `${x},${y}`;
}

function cellFrom(key: string): Cell {
  const [x, y] = key.split(",").map(Number);

  return [x, y];
}
