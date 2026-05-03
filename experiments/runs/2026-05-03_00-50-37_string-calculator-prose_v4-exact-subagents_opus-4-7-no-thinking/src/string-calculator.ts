export function add(numbers: string): number {
  return numbers.split(",").reduce((sum, num) => sum + Number(num), 0);
}
