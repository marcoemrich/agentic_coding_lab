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
    NEIGHBOR_OFFSETS.filter(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      return isInBounds(nr, nc) && grid[nr][nc];
    }).length;

  const survives = (neighbors: number): boolean => neighbors === 2 || neighbors === 3;
  const spawns = (neighbors: number): boolean => neighbors === 3;

  const nextGrid = grid.map((row, r) =>
    row.map((cell, c) => {
      const neighbors = countNeighbors(r, c);
      return cell ? survives(neighbors) : spawns(neighbors);
    })
  );

  const anyAlive = (g: boolean[][]): boolean => g.some(row => row.some(cell => cell));
  return anyAlive(nextGrid) ? nextGrid : [];
}
