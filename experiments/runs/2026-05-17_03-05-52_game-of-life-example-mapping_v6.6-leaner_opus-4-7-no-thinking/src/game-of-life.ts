export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const keyOf = ([x, y]: Cell): string => `${x},${y}`;

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(keyOf));
  const neighborCounts = new Map<string, [Cell, number]>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighbor: Cell = [x + dx, y + dy];
      const key = keyOf(neighbor);
      const entry = neighborCounts.get(key);
      if (entry) entry[1]++;
      else neighborCounts.set(key, [neighbor, 1]);
    }
  }

  const nextGen: Cell[] = [];
  for (const [key, [cell, count]] of neighborCounts) {
    if (count === 3 || (count === 2 && liveKeys.has(key))) {
      nextGen.push(cell);
    }
  }
  return nextGen;
}
