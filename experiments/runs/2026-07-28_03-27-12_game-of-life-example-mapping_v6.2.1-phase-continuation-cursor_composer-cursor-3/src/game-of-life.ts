type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function parseCellKey(key: string): Cell {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

function forEachNeighbor(
  x: number,
  y: number,
  visit: (nx: number, ny: number) => void,
): void {
  for (const [dx, dy] of NEIGHBOR_OFFSETS) {
    visit(x + dx, y + dy);
  }
}

function countLiveNeighbors(
  x: number,
  y: number,
  live: Set<string>,
): number {
  let count = 0;
  forEachNeighbor(x, y, (nx, ny) => {
    if (live.has(cellKey(nx, ny))) {
      count++;
    }
  });
  return count;
}

function survives(neighborCount: number): boolean {
  return neighborCount === 2 || neighborCount === 3;
}

function isBorn(neighborCount: number): boolean {
  return neighborCount === 3;
}

function countBirthCandidates(
  live: Set<string>,
  cells: Cell[],
): Map<string, number> {
  const birthCandidates = new Map<string, number>();

  for (const [x, y] of cells) {
    forEachNeighbor(x, y, (nx, ny) => {
      const key = cellKey(nx, ny);
      if (!live.has(key)) {
        birthCandidates.set(key, (birthCandidates.get(key) ?? 0) + 1);
      }
    });
  }

  return birthCandidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const live = new Set(cells.map(([x, y]) => cellKey(x, y)));
  const birthCandidates = countBirthCandidates(live, cells);

  const survivors = cells.filter(([x, y]) =>
    survives(countLiveNeighbors(x, y, live)),
  );

  const newborns = [...birthCandidates.entries()]
    .filter(([, count]) => isBorn(count))
    .map(([key]) => parseCellKey(key));

  return [...survivors, ...newborns];
}
