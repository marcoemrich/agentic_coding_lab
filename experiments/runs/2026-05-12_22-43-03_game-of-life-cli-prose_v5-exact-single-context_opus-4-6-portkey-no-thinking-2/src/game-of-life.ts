export type Cell = [number, number];

const cellKey = (x: number, y: number): string => `${x},${y}`;

const parseKey = (key: string): Cell => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};

const neighborKeys = (x: number, y: number): string[] => {
  const keys: string[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      keys.push(cellKey(x + dx, y + dy));
    }
  }
  return keys;
};

const countNeighbors = (x: number, y: number, alive: Set<string>): number =>
  neighborKeys(x, y).filter(key => alive.has(key)).length;

const compareCells = (a: Cell, b: Cell): number => a[0] - b[0] || a[1] - b[1];

export const nextGeneration = (cells: Cell[]): Cell[] => {
  const alive = new Set(cells.map(([x, y]) => cellKey(x, y)));

  const survivors = cells.filter(([x, y]) => {
    const neighborCount = countNeighbors(x, y, alive);
    return neighborCount === 2 || neighborCount === 3;
  });

  const deadCandidates = new Set<string>();
  for (const [x, y] of cells) {
    for (const key of neighborKeys(x, y)) {
      if (!alive.has(key)) deadCandidates.add(key);
    }
  }

  const births: Cell[] = [];
  for (const key of deadCandidates) {
    const [x, y] = parseKey(key);
    if (countNeighbors(x, y, alive) === 3) {
      births.push([x, y]);
    }
  }

  return [...survivors, ...births].sort(compareCells);
};

export const simulate = (cells: Cell[], steps: number): Cell[] => {
  let current = cells;
  for (let i = 0; i < steps; i++) {
    current = nextGeneration(current);
  }
  return current;
};
