export type Cell = [x: number, y: number];

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(toCoordinateKey));

  // Only cells adjacent to a live cell can have a non-zero neighbor count, so
  // counting outward from the live cells visits every cell whose fate is not
  // already decided. Everything absent from this map has 0 live neighbors and
  // therefore cannot be alive next generation, live or not.
  const liveNeighborCounts = new Map<string, number>();
  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = toCoordinateKey(neighbor);
      liveNeighborCounts.set(key, (liveNeighborCounts.get(key) ?? 0) + 1);
    }
  }

  const nextGen: Cell[] = [];
  for (const [key, liveNeighbors] of liveNeighborCounts) {
    if (isAliveNextGeneration(liveNeighbors, liveKeys.has(key))) {
      nextGen.push(fromCoordinateKey(key));
    }
  }
  return nextGen;
}

// Conway's four rules, stated as the two cases that produce life. Cells that
// match neither are simply never emitted, which is how underpopulation
// (< 2 neighbors) and overpopulation (> 3 neighbors) take effect.
const NEIGHBORS_FOR_BIRTH = 3;
const NEIGHBORS_FOR_SURVIVAL = 2;

const isAliveNextGeneration = (
  liveNeighbors: number,
  isCurrentlyAlive: boolean,
): boolean => {
  const hasExactlyThreeNeighbors = liveNeighbors === NEIGHBORS_FOR_BIRTH;
  const isLiveCellWithTwoNeighbors =
    liveNeighbors === NEIGHBORS_FOR_SURVIVAL && isCurrentlyAlive;
  return hasExactlyThreeNeighbors || isLiveCellWithTwoNeighbors;
};

// The eight surrounding directions, listed rather than derived: the cell
// itself is excluded by simply not being in the list.
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

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]): Cell => [x + dx, y + dy]);

// Cells are compared by value but JS Set/Map compare tuples by identity, so
// coordinates round-trip through a string key to get value semantics.
const toCoordinateKey = ([x, y]: Cell): string => `${x},${y}`;

const fromCoordinateKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};
