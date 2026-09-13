export type Cell = [number, number];

const toKey = (cell: Cell): string => `${cell[0]},${cell[1]}`;

const fromKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const neighborsOf = (cell: Cell): Cell[] => {
  const [x, y] = cell;
  const offsets = [-1, 0, 1];
  return offsets.flatMap((dx) =>
    offsets
      .filter((dy) => dx !== 0 || dy !== 0)
      .map((dy): Cell => [x + dx, y + dy]),
  );
};

const liveNeighborCounts = (cells: Cell[]): Map<string, number> => {
  const counts = new Map<string, number>();
  cells.forEach((cell) =>
    neighborsOf(cell).forEach((neighbor) => {
      const key = toKey(neighbor);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }),
  );
  return counts;
};

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const living = new Set(cells.map(toKey));

  return [...liveNeighborCounts(cells)]
    .filter(([key, liveNeighbors]) =>
      living.has(key) ? liveNeighbors === 2 || liveNeighbors === 3 : liveNeighbors === 3,
    )
    .map(([key]) => fromKey(key));
};
