export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = (x: number, y: number) => `${x},${y}`;

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

type NeighborEntry = { cell: Cell; count: number; alive: boolean };

function neighborhoodOf(cells: Cell[]): Map<string, NeighborEntry> {
  const neighborhood = new Map<string, NeighborEntry>();
  const entryAt = (x: number, y: number): NeighborEntry => {
    const k = keyOf(x, y);
    const entry = neighborhood.get(k) ?? { cell: [x, y], count: 0, alive: false };
    neighborhood.set(k, entry);
    return entry;
  };
  for (const [x, y] of cells) {
    entryAt(x, y).alive = true;
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      entryAt(x + dx, y + dy).count++;
    }
  }
  return neighborhood;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  return Array.from(neighborhoodOf(cells).values())
    .filter(({ alive, count }) => survives(alive, count))
    .map(({ cell }) => cell);
}
