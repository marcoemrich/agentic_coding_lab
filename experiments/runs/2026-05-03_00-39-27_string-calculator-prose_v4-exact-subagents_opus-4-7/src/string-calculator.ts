export function add(numbers: string): number {
  if (numbers === "") return 0;
  return numbers.split(",").reduce((sum, part) => sum + Number(part), 0);
}
