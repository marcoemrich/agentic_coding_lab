export function add(numbers: string): number {
  return numbers.split(",").map(Number).reduce((sum, n) => sum + n, 0);
}
