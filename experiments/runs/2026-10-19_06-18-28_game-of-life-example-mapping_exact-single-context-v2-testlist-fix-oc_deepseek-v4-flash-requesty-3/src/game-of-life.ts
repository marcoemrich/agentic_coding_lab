export type Cell = [number, number];

const MIN_LIVE_NEIGHBORS = 2;
const MAX_LIVE_NEIGHBORS = 3;

const key = (x: number, y: number) => `${x},${y}`;

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => key(x, y)));

  const neighbors = (x: number, y: number) => [
    [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
    [x - 1, y], [x + 1, y],
    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
  ];

  const liveCount = (x: number, y: number) =>
    neighbors(x, y).filter(([nx, ny]) => live.has(key(nx, ny))).length;

  const candidates = new Set<string>();
  cells.forEach(([x, y]) => {
    neighbors(x, y).forEach(([nx, ny]) => candidates.add(key(nx, ny)));
    candidates.add(key(x, y));
  });

  const next: Cell[] = [];
  candidates.forEach((k) => {
    const [x, y] = k.split(",").map(Number);
    const count = liveCount(x, y);
    if (live.has(k)) {
      if (count >= MIN_LIVE_NEIGHBORS && count <= MAX_LIVE_NEIGHBORS) next.push([x, y]);
    } else {
      if (count === MAX_LIVE_NEIGHBORS) next.push([x, y]);
    }
  });

  return next.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}