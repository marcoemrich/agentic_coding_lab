export function add(numbers: string): number {
  if (numbers === "") return 0;
  const numberStrings = numbers.split(",");
  return numberStrings.reduce((sum, numStr) => sum + Number(numStr), 0);
}
