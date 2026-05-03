export function add(input: string): number {
  if (input === "") {
    return 0;
  }
  return input
    .split(",")
    .map(n => parseInt(n, 10))
    .reduce((sum, num) => sum + num, 0);
}
