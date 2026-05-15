export type Cell = [number, number];

const NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

const neighborsOf = ([x, y]: Cell): Cell[] =>
  NEIGHBOR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy]);

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveKeys = new Set(cells.map(cellKey));
  const isLive = (cell: Cell): boolean => liveKeys.has(cellKey(cell));
  const isDead = (cell: Cell): boolean => !isLive(cell);
  const countLiveNeighbors = (cell: Cell): number =>
    neighborsOf(cell).filter(isLive).length;
  const survives = (cell: Cell): boolean => {
    const count = countLiveNeighbors(cell);
    return count === 2 || count === 3;
  };
  const isBorn = (cell: Cell): boolean => countLiveNeighbors(cell) === 3;

  const uniqueDeadNeighbors = [
    ...new Map(
      cells.flatMap(neighborsOf).filter(isDead).map((cell) => [cellKey(cell), cell]),
    ).values(),
  ];

  const survivors = cells.filter(survives);
  const births = uniqueDeadNeighbors.filter(isBorn);

  return [...survivors, ...births];
}
