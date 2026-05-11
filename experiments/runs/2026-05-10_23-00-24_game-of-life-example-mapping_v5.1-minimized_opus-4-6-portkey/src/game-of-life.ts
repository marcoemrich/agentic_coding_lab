const toKey = (x: number, y: number): string => `${x},${y}`;
const fromKey = (key: string): [number, number] => key.split(",").map(Number) as [number, number];

const neighbors = (x: number, y: number): [number, number][] => {
  const result: [number, number][] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      result.push([x + dx, y + dy]);
    }
  }
  return result;
};

export const nextGeneration = (cells: [number, number][]): [number, number][] => {
  const alive = new Set(cells.map(([x, y]) => toKey(x, y)));

  const countAliveNeighbors = (x: number, y: number): number =>
    neighbors(x, y).filter(([nx, ny]) => alive.has(toKey(nx, ny))).length;

  const survivors = cells.filter(([x, y]) => {
    const n = countAliveNeighbors(x, y);
    return n === 2 || n === 3;
  });

  const candidates = new Set<string>();
  for (const [x, y] of cells) {
    for (const [nx, ny] of neighbors(x, y)) {
      const key = toKey(nx, ny);
      if (!alive.has(key)) {
        candidates.add(key);
      }
    }
  }

  const births = [...candidates]
    .map(fromKey)
    .filter(([x, y]) => countAliveNeighbors(x, y) === 3);

  return [...survivors, ...births];
};
