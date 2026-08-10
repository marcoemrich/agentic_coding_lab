export type Cell = [number, number];

const neighborOffsets: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],            [0, 1],
  [1, -1],  [1, 0],   [1, 1],
];

const keyOf = (x: number, y: number): string => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const living = new Set(cells.map(([x, y]) => keyOf(x, y)));
  const candidates = new Map<string, Cell>();

  for (const [x, y] of cells) {
    candidates.set(keyOf(x, y), [x, y]);
    for (const [dx, dy] of neighborOffsets) {
      candidates.set(keyOf(x + dx, y + dy), [x + dx, y + dy]);
    }
  }

  return [...candidates.values()].filter(([x, y]) => {
    const liveNeighbors = neighborOffsets.filter(([dx, dy]) =>
      living.has(keyOf(x + dx, y + dy)),
    ).length;
    return liveNeighbors === 3 || (liveNeighbors === 2 && living.has(keyOf(x, y)));
  });
}
