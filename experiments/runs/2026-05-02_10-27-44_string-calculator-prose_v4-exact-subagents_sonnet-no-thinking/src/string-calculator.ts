export function add(numbers: string): number {
  if (numbers === "") return 0;
  return numbers
    .split(",")
    .map((n) => parseInt(n, 10))
    .reduce((sum, n) => sum + n, 0);
}
