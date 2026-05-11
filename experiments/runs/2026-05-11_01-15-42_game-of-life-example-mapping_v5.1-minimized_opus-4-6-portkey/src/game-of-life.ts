const toKey = (x: number, y: number): string => `${x},${y}`;

const neighborKeys = (x: number, y: number): string[] => {
  const keys: string[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      keys.push(toKey(x + dx, y + dy));
    }
  }
  return keys;
};

const countNeighbors = (x: number, y: number, alive: Set<string>): number =>
  neighborKeys(x, y).filter((key) => alive.has(key)).length;

const deadNeighbors = (cells: [number, number][], alive: Set<string>): [number, number][] => {
  const candidates = new Set<string>();
  for (const [x, y] of cells) {
    for (const key of neighborKeys(x, y)) {
      if (!alive.has(key)) candidates.add(key);
    }
  }
  return [...candidates].map((key) => key.split(",").map(Number) as [number, number]);
};

export const nextGeneration = (cells: [number, number][]): [number, number][] => {
  const alive = new Set(cells.map(([x, y]) => toKey(x, y)));

  const survivors = cells.filter(([x, y]) =>
    [2, 3].includes(countNeighbors(x, y, alive))
  );

  const births = deadNeighbors(cells, alive).filter(([x, y]) =>
    countNeighbors(x, y, alive) === 3
  );

  return [...survivors, ...births];
};
