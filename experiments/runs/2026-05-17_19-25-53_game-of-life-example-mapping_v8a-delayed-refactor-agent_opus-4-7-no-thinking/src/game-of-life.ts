export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveSet = new Set(cells.map(toKey));
  const neighborCounts = new Map<string, number>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const k = toKey([x + dx, y + dy]);
      neighborCounts.set(k, (neighborCounts.get(k) ?? 0) + 1);
    }
  }

  const survivors: Cell[] = [];
  for (const [k, count] of neighborCounts) {
    if (count === 3 || (count === 2 && liveSet.has(k))) {
      survivors.push(fromKey(k));
    }
  }
  return survivors;
}

function toKey([x, y]: readonly [number, number]): string {
  return `${x},${y}`;
}

function fromKey(k: string): Cell {
  const [x, y] = k.split(',').map(Number);
  return [x, y];
}
