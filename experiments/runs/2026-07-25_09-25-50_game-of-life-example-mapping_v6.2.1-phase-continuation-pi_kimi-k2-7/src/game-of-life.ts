type Cell = [number, number];

const NEIGHBOR_OFFSETS: readonly [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function formatCell([x, y]: Cell): string {
  return `${x},${y}`;
}

function parseCell(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(formatCell));
  const neighborCountsByKey = new Map<string, number>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const neighborKey = formatCell([x + dx, y + dy]);
      neighborCountsByKey.set(
        neighborKey,
        (neighborCountsByKey.get(neighborKey) || 0) + 1,
      );
    }
  }

  const next: Cell[] = [];
  for (const [key, count] of neighborCountsByKey) {
    const isLive = liveKeys.has(key);
    const willBeAlive = count === 3 || (count === 2 && isLive);
    if (willBeAlive) {
      next.push(parseCell(key));
    }
  }

  return next;
}
