type Grid = number[][];
type Coord = [number, number];

const toKey = (r: number, c: number): string => `${r},${c}`;

const parseKey = (key: string): Coord => key.split(",").map(Number) as Coord;

const gridToLiveCells = (grid: Grid): Set<string> => {
  const live = new Set<string>();
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r]?.length ?? 0); c++) {
      if (grid[r][c] === 1) live.add(toKey(r, c));
    }
  }
  return live;
};

const getNeighborCoords = (r: number, c: number): Coord[] => {
  const neighbors: Coord[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      neighbors.push([r + dr, c + dc]);
    }
  }
  return neighbors;
};

const countLiveNeighbors = (live: Set<string>, r: number, c: number): number => {
  return getNeighborCoords(r, c).filter(([nr, nc]) => live.has(toKey(nr, nc))).length;
};

const willCellLive = (alive: boolean, neighbors: number): boolean =>
  (alive && (neighbors === 2 || neighbors === 3)) || (!alive && neighbors === 3);

const liveCellsToGrid = (nextLive: Set<string>): Grid => {
  if (nextLive.size === 0) return [];
  const coords = [...nextLive].map(parseKey);
  const minR = Math.min(...coords.map(([r]) => r));
  const maxR = Math.max(...coords.map(([r]) => r));
  const minC = Math.min(...coords.map(([, c]) => c));
  const maxC = Math.max(...coords.map(([, c]) => c));
  const grid: Grid = [];
  for (let r = minR; r <= maxR; r++) {
    const row: number[] = [];
    for (let c = minC; c <= maxC; c++) {
      row.push(nextLive.has(toKey(r, c)) ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
};

export function nextGeneration(grid: Grid): Grid {
  if (grid.length === 0) return [];
  const live = gridToLiveCells(grid);
  if (live.size === 0) return [];

  const candidates = new Set<string>();
  for (const key of live) {
    candidates.add(key);
    const [r, c] = parseKey(key);
    for (const [nr, nc] of getNeighborCoords(r, c)) {
      candidates.add(toKey(nr, nc));
    }
  }

  const nextLive = new Set<string>();
  for (const key of candidates) {
    const [r, c] = parseKey(key);
    const alive = live.has(key);
    const neighbors = countLiveNeighbors(live, r, c);
    if (willCellLive(alive, neighbors)) {
      nextLive.add(key);
    }
  }

  return liveCellsToGrid(nextLive);
}
