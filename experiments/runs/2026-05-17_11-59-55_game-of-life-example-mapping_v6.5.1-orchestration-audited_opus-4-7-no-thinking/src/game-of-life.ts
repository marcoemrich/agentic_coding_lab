export type CellCoordinate = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<CellCoordinate> = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

const coordKey = (x: number, y: number): string => `${x},${y}`;

const survives = (isAlive: boolean, neighborCount: number): boolean =>
  neighborCount === 3 || (isAlive && neighborCount === 2);

export const nextGeneration = (liveCells: CellCoordinate[]): CellCoordinate[] => {
  const liveSet = new Set(liveCells.map(([x, y]) => coordKey(x, y)));
  const neighborCounts = new Map<string, { coord: CellCoordinate; count: number }>();

  for (const [x, y] of liveCells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const coord: CellCoordinate = [x + dx, y + dy];
      const k = coordKey(coord[0], coord[1]);
      const prevCount = neighborCounts.get(k)?.count ?? 0;
      neighborCounts.set(k, { coord, count: prevCount + 1 });
    }
  }

  const result: CellCoordinate[] = [];
  for (const [k, { coord, count }] of neighborCounts) {
    if (survives(liveSet.has(k), count)) result.push(coord);
  }
  return result;
};
