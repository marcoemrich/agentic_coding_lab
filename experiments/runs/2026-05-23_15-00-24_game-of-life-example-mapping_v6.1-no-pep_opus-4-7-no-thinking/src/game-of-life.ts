export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function neighborsOf([x, y]: Cell): Cell[] {
  return NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);
}

function survivesOrIsBorn(neighborCount: number, wasAlive: boolean): boolean {
  return neighborCount === 3 || (neighborCount === 2 && wasAlive);
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveKeys = new Set(liveCells.map(cellKey));
  const neighborCountByKey = new Map<string, number>();
  const cellByKey = new Map<string, Cell>();

  for (const liveCell of liveCells) {
    for (const neighbor of neighborsOf(liveCell)) {
      const key = cellKey(neighbor);
      neighborCountByKey.set(key, (neighborCountByKey.get(key) ?? 0) + 1);
      cellByKey.set(key, neighbor);
    }
  }

  const result: Cell[] = [];
  for (const [key, cell] of cellByKey) {
    if (survivesOrIsBorn(neighborCountByKey.get(key) ?? 0, liveKeys.has(key))) {
      result.push(cell);
    }
  }
  return result;
}
