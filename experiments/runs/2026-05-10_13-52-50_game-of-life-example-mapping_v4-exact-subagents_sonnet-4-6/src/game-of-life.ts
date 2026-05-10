const NEIGHBOR_OFFSETS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

export function nextGeneration(grid: boolean[][]): boolean[][] {
  if (grid.length === 0) return [];

  const rows = grid.length;
  const cols = grid[0].length;

  const isInBounds = (r: number, c: number): boolean =>
    r >= 0 && r < rows && c >= 0 && c < cols;

  const countNeighbors = (r: number, c: number): number =>
    NEIGHBOR_OFFSETS.filter(([dr, dc]) => isInBounds(r + dr, c + dc) && grid[r + dr][c + dc]).length;

  const survives = (neighbors: number): boolean => neighbors === 2 || neighbors === 3;
  const isReborn = (neighbors: number): boolean => neighbors === 3;

  const next = grid.map((row, r) =>
    row.map((cell, c) => {
      const neighbors = countNeighbors(r, c);
      return cell ? survives(neighbors) : isReborn(neighbors);
    })
  );

  const hasLiveCell = next.some(row => row.some(cell => cell));
  return hasLiveCell ? next : [];
}
