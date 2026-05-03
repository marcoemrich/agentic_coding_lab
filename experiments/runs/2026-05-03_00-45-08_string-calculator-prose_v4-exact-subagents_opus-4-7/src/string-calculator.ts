export function add(numbers: string): number {
  return numbers
    .split(",")
    .reduce((sum, part) => sum + Number(part), 0);
}
