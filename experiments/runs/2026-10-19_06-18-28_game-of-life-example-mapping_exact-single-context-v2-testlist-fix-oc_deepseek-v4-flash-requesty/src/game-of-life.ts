export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];

const MIN_SURVIVE = 2;
const MAX_SURVIVE = 3;

function key(x: number, y: number): string {
  return `${x},${y}`;
}

function countLiveNeighbors(live: Set<string>, x: number, y: number): number {
  let count = 0;
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    if (live.has(key(x + dx, y + dy))) count++;
  }
  return count;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set<string>();
  for (const [x, y] of cells) {
    live.add(key(x, y));
  }

  const candidates = new Set<string>(live);
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      candidates.add(key(x + dx, y + dy));
    }
  }

  const next: Cell[] = [];
  for (const k of candidates) {
    const [xs, ys] = k.split(",");
    const x = Number(xs);
    const y = Number(ys);
    const neighbors = countLiveNeighbors(live, x, y);
    const isAlive = live.has(k);
    const survives = (isAlive && neighbors >= MIN_SURVIVE && neighbors <= MAX_SURVIVE)
      || (!isAlive && neighbors === MAX_SURVIVE);
    if (survives) {
      next.push([x, y]);
    }
  }

  return next.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}